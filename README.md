# MyApp Monorepo

This is a monorepo containing the UroCenter application for multiple platforms: Web, iOS, Android, and Desktop.

## Project Structure

```
MyApp-Monorepo/
├─ web/                 # React web application (current)
├─ android/            # Android native application
├─ ios/               # iOS native application
├─ desktop/           # Desktop application
└─ shared/            # Shared resources and documentation
```

## Platform-Specific Instructions

### Web Application (Current)
The web application is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

To run the web application:
```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

### Native Applications

The native applications (iOS, Android, Desktop) are located in their respective platform branches:
- `platform/ios`
- `platform/android`
- `platform/desktop`

To work on a specific platform, checkout the corresponding branch:
```sh
git checkout platform/ios     # For iOS development
git checkout platform/android # For Android development
git checkout platform/desktop # For Desktop development
```

## Development Guidelines

1. **Branch Strategy**
   - `main`: Web application (current)
   - `platform/ios`: iOS native app
   - `platform/android`: Android native app
   - `platform/desktop`: Desktop native app

2. **Shared Resources**
   - Common assets and resources are stored in the `shared` directory
   - Each platform implements the same features while following platform-specific best practices

3. **Code Style**
   - Follow platform-specific conventions
   - Maintain consistent naming across platforms
   - Document platform-specific implementation details

## Building and Running

Each platform has its own build process and requirements. See the platform-specific README files in each branch for detailed instructions.

## Contributing

1. Create a feature branch from the appropriate platform branch
2. Implement changes following platform guidelines
3. Submit a PR to the corresponding platform branch
4. Ensure CI passes and review requirements are met

## License

This project is private and confidential. All rights reserved.