# UroCenter Monorepo

This is a monorepo containing the UroCenter application for multiple platforms: Web, iOS, Android, and Desktop.

## Project Structure

```
UroCenter/
├─ src/                # React web application source code
├─ android/            # Android application (Capacitor)
├─ ios/               # iOS application (Capacitor)
├─ desktop/           # Desktop application
├─ dist/              # Built web application
└─ shared/            # Shared resources and documentation
```

## Platform-Specific Instructions

### Web Application
The web application is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for mobile platforms)

To run the web application:
```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

### Mobile Applications (Capacitor)

The mobile applications are built using Capacitor, which allows us to run our web application natively on iOS and Android.

#### Prerequisites
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Node.js and npm

#### Building for Mobile

1. Build the web application:
```sh
npm run build
```

2. Sync with Capacitor:
```sh
npx cap sync
```

3. Open in IDE:
```sh
# For Android
npx cap open android

# For iOS (macOS only)
npx cap open ios
```

#### Development Workflow

1. Make changes to the web application
2. Run `npm run build`
3. Run `npx cap sync` to update native projects
4. Test on native platform
5. Repeat

### Desktop Application

The desktop application is located in the `desktop` directory. See the desktop-specific README for more details.

## Development Guidelines

1. **Branch Strategy**
   - `main`: Main development branch
   - Feature branches: `feature/your-feature-name`

2. **Shared Resources**
   - Common assets and resources are stored in the `shared` directory
   - Each platform implements the same features while following platform-specific best practices

3. **Code Style**
   - Follow TypeScript/React best practices
   - Maintain consistent naming across platforms
   - Document platform-specific implementation details

## Building and Running

### Web
```sh
npm install
npm run dev
```

### Android
```sh
npm run build
npx cap sync
npx cap open android
```

### iOS (macOS only)
```sh
npm run build
npx cap sync
npx cap open ios
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Implement changes following project guidelines
3. Submit a PR to the main branch
4. Ensure CI passes and review requirements are met

## License

This project is private and confidential. All rights reserved.