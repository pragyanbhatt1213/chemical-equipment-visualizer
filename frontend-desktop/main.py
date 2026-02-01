import sys
from windows.dashboard import DashboardWindow

from PyQt5.QtWidgets import (
    QApplication, QWidget, QLabel, QLineEdit,
    QPushButton, QVBoxLayout, QMessageBox
)

from api_client import APIClient


class LoginWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.api = APIClient()
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle("Chemical Equipment Visualizer - Login")
        self.setGeometry(300, 200, 300, 200)

        layout = QVBoxLayout()

        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Username")

        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Password")
        self.password_input.setEchoMode(QLineEdit.Password)

        login_button = QPushButton("Login")
        login_button.clicked.connect(self.handle_login)

        layout.addWidget(QLabel("Login"))
        layout.addWidget(self.username_input)
        layout.addWidget(self.password_input)
        layout.addWidget(login_button)

        self.setLayout(layout)

    def handle_login(self):
        username = self.username_input.text()
        password = self.password_input.text()

        success = self.api.login(username, password)

        if success:
            self.dashboard = DashboardWindow(self.api)
            # Load history after showing dashboard
            self.dashboard.load_history()
            self.dashboard.show()
            self.close()

        else:
            QMessageBox.critical(self, "Error", "Invalid credentials")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = LoginWindow()
    window.show()
    sys.exit(app.exec_())
