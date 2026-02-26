# Welcome to Mini Tracking App app 👋


## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🚀 [More](#more)

## <a name="introduction">🤖 Introduction</a>

Built with React Native, TypeScript, and NativeWind, this lightweight transaction tracking app delivers a smooth and responsive user experience with gesture-driven interactions and animated UI elements. It features animated bottom sheets for adding and managing transactions, quick-select categories and amounts, and dynamic filtering for easy browsing. With asynchronous loading states, pull-to-refresh support, and robust state management using Zustand, the app ensures seamless performance even with growing transaction data. Designed to be intuitive, responsive, and visually engaging, it makes tracking personal expenses fast and effortless.

## <a name="tech-stack">⚙️ Tech Stack</a>
1.	- **TypeScript**
	Adds static typing to JavaScript, ensuring type safety and reducing runtime errors, Helps structure your data models (e.g., Transaction type) and improves code maintainability.
		
   - **Expo**
	   Provides a managed React Native workflow, simplifying development, building, and testing across iOS and Android, Offers access to device APIs like camera, location, and notifications without extra native configuration.

	- **React Native**
      Core framework for building cross-platform mobile apps using React.Enables creating smooth UI components and handling touch interactions efficiently.

	- **Zustand**
	   Lightweight state management library for React/React Native.
	   Manages app-wide state like transactions, filters, and loaded counts in a simple and performant way.

	- **Zod**
		Type-safe schema validation library.
	   Validates forms and input fields (like merchant name, amount, and category) to prevent invalid transactions.

	- **React Native Reanimated**
	   Handles complex animations in React Native with smooth, native-thread performance.
	   Powers animated bottom sheets, gestures, and UI transitions in the app.

	-  **React Native Gesture Handler**
	   Improves touch and gesture interactions beyond the standard React Native touch system.
	   Enables swipe, drag, and pan gestures for the bottom sheet and interactive components.


## <a name="features">🔋 Features</a>

### Features of the Mini Transaction Tracking App

👉 **Loading & Refresh Cntrol**: Smooth asynchronous loading states for transactions with animated pull-to-refresh, keeping the UI responsive while fetching or updating data.

👉 **Animated UI & Sheets**:  Gesture-driven, animated bottom sheets for adding transactions, with spring animations, interactive dragging, and natural motion.

👉 **Animated Text & Route Transitions**: Screen transitions and text animations for dynamic feedback, making navigation feel fluid and responsive.

👉 **Zustand State Management**:Centralized and lightweight state management for all transactions, filters, loaded counts, and UI states.

👉 **Zod Input Validation**: Schema-based validation for forms, ensuring transactions are complete and valid before submission.

👉 **Transaction Screen**: 

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

