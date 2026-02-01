import matplotlib.pyplot as plt


def show_type_distribution_chart(type_distribution):
    labels = list(type_distribution.keys())
    values = list(type_distribution.values())

    plt.figure(figsize=(6, 4))
    plt.bar(labels, values)
    plt.title("Equipment Type Distribution")
    plt.xlabel("Type")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.show()
