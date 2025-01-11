#include "SignIn.h"

SignIn::SignIn(QWidget *parent) : QWidget(parent) {
    layout = new QVBoxLayout(this);
    titleLabel = new QLabel("Sign In", this);
    layout->addWidget(titleLabel);
    layout->setAlignment(Qt::AlignCenter);
    setLayout(layout);
}