// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Shared",
    platforms: [
      .macOS(.v10_10)
    ],
    products: [
        // Products define the executables and libraries a package produces, and make them visible to other packages.
        .library(
            name: "Shared",
            targets: [
              "Shared"
            ]
        ),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
      .package(
            url: "https://github.com/apple/swift-atomics.git",
            .upToNextMajor(from: "1.0.0") // or `.upToNextMinor
          )
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages this package depends on.
        .target(
            name: "Shared",
            dependencies: [
              .product(name: "Atomics", package: "swift-atomics")
            ],
            path: "Source"
        )
    ],
    swiftLanguageVersions: [
        .version("5")
    ]
)
