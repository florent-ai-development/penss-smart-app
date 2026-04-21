# React Native Developer Rules

## Core Principles

- Simple and reliable over clever and fragile. Prefer the solution a new teammate can understand in 30 seconds.
- Don't add abstractions until they're earned. Three similar JSX blocks is fine; a premature generic component factory is not.
- Write correct code first, optimize only what profiling shows is slow.

## Tech Stack

- **Language**: TypeScript, strict mode always (`"strict": true` in tsconfig)
- **Framework**: Expo (follow what's already in the project)
- **Navigation**: React Navigation — stack, tabs, drawer as needed. Nothing custom unless justified.
- **State**: Zustand for global state, React Context for narrow scoped state, local `useState`/`useReducer` for component state
- **Data fetching**: React Query (`@tanstack/react-query`) — cache, loading, error states. Never duplicate server data in local state.
- **Styling**: `StyleSheet.create` always. No inline style objects in JSX. No magic numbers without a named constant.

## Code Style

- Functional components only. No class components.
- Custom hooks own all logic. If a component has more than ~2 `useState` calls or any `useEffect`, extract a `use<FeatureName>` hook. The component renders; the hook thinks.
- Props stay flat. A component that takes 8 props probably needs to be split. A component that passes 5 props down 3 levels needs a Context or a state manager.
- Naming is documentation: `handleSubmitLoginForm` > `handleSubmit`. Boolean props: `isLoading`, `hasError`, `canSubmit`. Event handlers: `onPress`, `onChangeText`, `onSubmit`.
- No magic numbers — define named constants: `const HEADER_HEIGHT = 56;`
- Types over interfaces for unions and primitives; interfaces for object shapes that get extended.
- TypeScript errors are bugs — fix them, don't cast with `as unknown as X`.

## Folder Structure (feature-based)

```
src/
  features/
    auth/
      components/       # UI only, no business logic
      hooks/            # useLogin, useSignup, etc.
      screens/          # Route-level components, thin wrappers
      types.ts
    home/
    profile/
  shared/
    components/         # Truly reusable UI primitives
    hooks/              # useDebounce, useKeyboard, etc.
    utils/              # Pure functions, no React
    constants/
  navigation/
    RootNavigator.tsx
    types.ts            # Route params typed here
  services/
    api/                # API clients, no business logic
    storage/            # AsyncStorage wrappers
```

## Separation of Concerns

| Layer | Responsibility | Rule |
|-------|---------------|------|
| Screen | Mount a feature, handle nav params | < 50 lines ideally |
| Component | Render UI, emit events upward | No direct API calls |
| Hook | Encapsulate stateful logic | No JSX |
| Service | Talk to APIs/storage | No React |
| Utils | Pure functions | No side effects |

## State Management Decision Tree

1. Data lives in one component → `useState`
2. Data is shared within a feature → `useContext` + a custom hook wrapping it
3. Data is global (auth, theme, user session) → Zustand store
4. Server data (fetched from API) → React Query

## Navigation

Always type route params:
```ts
// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};
```

## When Writing Code

- Read the files that will be affected before making changes.
- Match the existing code style of the file you're editing.
- Always handle loading, error, and empty states in React Query.
- For lists: always provide `keyExtractor`, consider `getItemLayout` for long lists.
- Avoid `useEffect` for derived state — compute inline or with `useMemo`.
- Prefer `Pressable` over `TouchableOpacity` for new code.
- Always wrap root screens in `SafeAreaView` or use `useSafeAreaInsets` (iOS safe area).

## When Refactoring

- One concern per PR — don't mix feature work with architecture refactors.
- Never change behavior and structure in the same commit.
- Leave the code cleaner than you found it, but don't refactor the whole file when asked to fix one thing.
