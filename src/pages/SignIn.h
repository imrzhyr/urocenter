#ifndef SIGNIN_H
#define SIGNIN_H

#include <QWidget>
#include <QLabel>
#include <QVBoxLayout>

class SignIn : public QWidget {
    Q_OBJECT
public:
    SignIn(QWidget *parent = nullptr);

private:
    QLabel *titleLabel;
    QVBoxLayout *layout;
};

#endif