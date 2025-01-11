import UIKit
import Supabase

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    static let supabase = SupabaseClient(
        supabaseURL: URL(string: "https://byjyyshxviieqkymavnh.supabase.co")!,
        supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anl5c2h4dmlpZXFreW1hdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjQ1ODMsImV4cCI6MjA1MTYwMDU4M30.iP1Tlz7tnwO9GDY4oW12fN8IwImcjkoLpBhdsCq1VwM"
    )

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        let signInVC = SignInViewController()
        let navigationController = UINavigationController(rootViewController: signInVC)
        window?.rootViewController = navigationController
        window?.makeKeyAndVisible()
        return true
    }
}