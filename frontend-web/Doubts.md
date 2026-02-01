🎤 Interview Question + Perfect Answer
Q1: What are props in React?

Answer:

Props are inputs passed from a parent component to a child component. They allow components to be reusable and enable parent-child communication. Props are read-only and can include both data and callback functions.

Q2: Why did you create a separate api.js file?

Answer:

I created a dedicated API layer to centralize all backend communication. This avoids duplication, improves maintainability, and follows separation of concerns. If the backend URL or API changes, I only update one file.

Q3: What does it mean when Axios returns a Promise?

Answer:

Axios returns a Promise because HTTP requests are asynchronous. The Promise represents the future response. I handle it using .then() or async/await to process the backend response once it arrives.

Q4: Why pass handleUploadSuccess as a prop?

Answer:

This allows the child component to notify the parent when the upload is complete. The parent controls application state, while the child remains focused on a single responsibility.

CORS- Cross origin resource sharing
What headers are added (core answer)

After installing and configuring CORS, Django responses include headers like:

Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization


These headers tell the browser:

“This backend explicitly allows requests from this frontend.”

Once the browser sees this → it unblocks the response.

5️⃣ Before vs After (CRYSTAL CLEAR)
❌ BEFORE CORS

Django response:

HTTP/1.1 201 Created
Content-Type: application/json


Browser:

❌ Block JS from reading response
Axios → error

✅ AFTER CORS

Django response:

HTTP/1.1 201 Created
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000


Browser:

✅ Allow JS to read response
Axios → success

6️⃣ What each CORS setting changes
corsheaders app
INSTALLED_APPS = ["corsheaders", ...]


➡️ Enables CORS logic in Django

CORS middleware
MIDDLEWARE = [
  "corsheaders.middleware.CorsMiddleware",
  "django.middleware.common.CommonMiddleware",
]


➡️ Intercepts every HTTP request/response
➡️ Injects CORS headers before response is sent

This is why order matters.

CORS_ALLOW_ALL_ORIGINS = True

Means:

“Allow ANY frontend origin to read my API responses.”

Used in:

Local development

Demos

College projects

❌ Not used in production (security risk)

7️⃣ What CORS does NOT do (important myths)

❌ It does NOT authenticate users
❌ It does NOT secure your API
❌ It does NOT prevent requests
❌ It does NOT run on the backend logic layer

CORS is only about browser permission to read responses.

8️⃣ Why Postman / curl works without CORS

Postman:

Is NOT a browser

Has NO same-origin policy

So:

Postman → Django → Works
Browser → Django → Blocked (without CORS)


This confuses beginners a LOT.

9️⃣ How this looks in real companies

In production, instead of:

CORS_ALLOW_ALL_ORIGINS = True


They use:

CORS_ALLOWED_ORIGINS = [
  "https://myapp.com",
  "https://admin.myapp.com",
]


This means:

Only trusted frontends allowed

Everyone else blocked

🎤 Interview Question + PERFECT Answer
Q: What is CORS and how did you handle it in your project?

Answer:

CORS is a browser security mechanism that restricts cross-origin access to API responses. My React frontend and Django backend were running on different origins, so although the backend processed requests correctly, the browser blocked the response. I solved this by enabling CORS in Django using middleware that adds appropriate HTTP headers, allowing the frontend to safely consume the API.

🔥 This answer shows real-world experience.

🧠 One-line Mental Model (remember forever)

CORS does not control who can SEND requests — it controls who can READ responses in a browser.




🧠 WHAT THE ISSUE WAS (IN SIMPLE WORDS)
The symptom

When calling:

/api/generate-pdf/<id>/


Django crashed with:

TypeError: expected str, bytes or os.PathLike object, not BytesIO


This happened while generating the PDF, not during routing or DB access.

🔍 ROOT CAUSE (IMPORTANT CONCEPT)

You were doing this correctly:

Generating a chart using Matplotlib

Saving the chart to memory using BytesIO

But then you tried to do:

pdf.drawImage(chart_buffer, ...)

Why this failed

drawImage() does NOT understand BytesIO.

Internally, ReportLab tries to do:

os.path.splitext(image)


But BytesIO is not a file path → crash.

✅ HOW WE FIXED IT (PROFESSIONAL WAY)

We used:

from reportlab.lib.utils import ImageReader


And converted:

BytesIO  →  ImageReader(BytesIO)

Correct fix:
chart_image = ImageReader(chart_buffer)
pdf.drawImage(chart_image, ...)

🧠 WHY THIS FIX IS CORRECT (INTERVIEW LEVEL)

ImageReader is ReportLab’s official bridge

It allows:

In-memory images

No temp files

Cleaner + faster execution

Interview-ready explanation:

“ReportLab’s drawImage() expects either a file path or an ImageReader. Since Matplotlib charts are generated in memory, I used ImageReader to safely embed them into the PDF.”