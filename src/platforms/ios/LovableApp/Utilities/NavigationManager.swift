import UIKit

class NavigationManager {
    static let shared = NavigationManager()
    private init() {}
    
    func navigateToDashboard(from viewController: UIViewController) {
        let dashboardVC = DashboardViewController()
        let navigationController = UINavigationController(rootViewController: dashboardVC)
        navigationController.modalPresentationStyle = .fullScreen
        viewController.present(navigationController, animated: true)
    }
    
    func navigateToChat(from viewController: UIViewController, userId: String) {
        let chatVC = ChatViewController(userId: userId)
        viewController.navigationController?.pushViewController(chatVC, animated: true)
    }
}