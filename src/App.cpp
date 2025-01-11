#include <QApplication>
#include <QMainWindow>
#include <QStackedWidget>
#include "SignIn.h"
#include "Dashboard.h"
#include "Chat.h"
#include "Database.h"

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr) : QMainWindow(parent) {
        Database::getInstance().initialize();
        setupUI();
    }

private:
    void setupUI() {
        stackedWidget = new QStackedWidget(this);
        signIn = new SignIn(this);
        dashboard = new Dashboard(this);
        chat = new Chat(this);

        stackedWidget->addWidget(signIn);
        stackedWidget->addWidget(dashboard);
        stackedWidget->addWidget(chat);

        setCentralWidget(stackedWidget);
        resize(800, 600);

        connect(signIn, &SignIn::signInSuccessful, this, &MainWindow::onSignInSuccess);
        connect(dashboard, &Dashboard::chatSelected, this, &MainWindow::onChatSelected);
    }

private slots:
    void onSignInSuccess() {
        stackedWidget->setCurrentWidget(dashboard);
    }

    void onChatSelected() {
        stackedWidget->setCurrentWidget(chat);
    }

private:
    QStackedWidget *stackedWidget;
    SignIn *signIn;
    Dashboard *dashboard;
    Chat *chat;
};

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);
    MainWindow mainWindow;
    mainWindow.show();
    return app.exec();
}

#include "main.moc"