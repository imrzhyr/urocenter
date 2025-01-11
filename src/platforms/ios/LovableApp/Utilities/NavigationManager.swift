import UIKit

class NavigationManager {
    static let shared = NavigationManager()
    
    func navigateToDashboard(from viewController: UIViewController) {
        let dashboardVC = DashboardViewController()
        let navigationController = UINavigationController(rootViewController: dashboardVC)
        
        UIView.transition(with: UIApplication.shared.windows.first!,
                         duration: 0.3,
                         options: .transitionCrossDissolve,
                         animations: {
            UIApplication.shared.windows.first?.rootViewController = navigationController
        })
    }
    
    func navigateToChat(from viewController: UIViewController, userId: String) {
        let chatVC = ChatViewController(userId: userId)
        viewController.navigationController?.pushViewController(chatVC, animated: true)
        
        // Configure custom transition
        let transition = CATransition()
        transition.duration = 0.3
        transition.type = .push
        transition.subtype = .fromRight
        viewController.navigationController?.view.layer.add(transition, forKey: nil)
    }
    
    func navigateBack(from viewController: UIViewController) {
        let transition = CATransition()
        transition.duration = 0.3
        transition.type = .push
        transition.subtype = .fromLeft
        viewController.navigationController?.view.layer.add(transition, forKey: nil)
        viewController.navigationController?.popViewController(animated: false)
    }
}