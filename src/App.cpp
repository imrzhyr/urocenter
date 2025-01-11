#include <QApplication>
#include <QMainWindow>
#include <QStackedWidget>
#include "SignIn.h"
#include "Dashboard.h"
#include "Chat.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    QMainWindow mainWindow;
    QStackedWidget stackedWidget(&mainWindow);

    SignIn signIn;
    Dashboard dashboard;
    Chat chat;

    stackedWidget.addWidget(&signIn);
    stackedWidget.addWidget(&dashboard);
    stackedWidget.addWidget(&chat);

    mainWindow.setCentralWidget(&stackedWidget);
    mainWindow.show();

    return app.exec();
}