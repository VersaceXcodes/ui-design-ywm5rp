import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// Types
interface AuthUser {
  user_id: string;
  token: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
}

interface ActiveProject {
  project_id: string;
  name: string;
}

interface CollaborativeUser {
  user_id: string;
  name: string;
}

// Initial States
const initialAuthState: AuthUser | null = null;
const initialNotificationList: Notification[] = [];
const initialActiveProject: ActiveProject | null = null;
const initialCollaborativeUsers: CollaborativeUser[] = [];

let socket: Socket | null = null;

// Slices
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    authenticate_user: (state, action: PayloadAction<AuthUser>) => action.payload,
    logout_user: () => null
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationList,
  reducers: {
    add_notification: (state, action: PayloadAction<Notification>) => {
      state.push(action.payload);
    },
    set_notifications: (_, action: PayloadAction<Notification[]>) => action.payload
  }
});

const projectSlice = createSlice({
  name: 'project',
  initialState: initialActiveProject,
  reducers: {
    set_active_project: (_, action: PayloadAction<ActiveProject>) => action.payload
  }
});

const collaboratorsSlice = createSlice({
  name: 'collaborators',
  initialState: initialCollaborativeUsers,
  reducers: {
    update_collaborators: (_, action: PayloadAction<CollaborativeUser[]>) => action.payload
  }
});

// Reducers Configuration
const persistConfig = { key: 'root', storage, whitelist: ['auth', 'notifications', 'project'] };

const rootReducer = {
  auth: authSlice.reducer,
  notifications: notificationSlice.reducer,
  project: projectSlice.reducer,
  collaborators: collaboratorsSlice.reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

const persistor = persistStore(store);

// WebSocket Connection
const initializeWebSocket = (token: string) => {
  if (socket) return;

  socket = io('http://localhost:1337', { auth: { token } });

  socket.on('project_update', (data) => {
    console.log('Realtime Project Update:', data);
  });

  socket.on('user_presence', (data: CollaborativeUser[]) => {
    store.dispatch(collaboratorsSlice.actions.update_collaborators(data));
  });

  socket.on('new_comment', (notification: Notification) => {
    store.dispatch(notificationSlice.actions.add_notification(notification));
  });

  socket.on('notification_update', (notification: Notification) => {
    store.dispatch(notificationSlice.actions.add_notification(notification));
  });
};

// Store Subscription: Auto Init WebSocket on Login
store.subscribe(() => {
  const state = store.getState() as { auth: AuthUser | null };
  if (state.auth?.token) initializeWebSocket(state.auth.token);
});

// Exports
export default store;
export { persistor };
export const {
  authenticate_user,
  logout_user
} = authSlice.actions;
export const {
  add_notification,
  set_notifications
} = notificationSlice.actions;
export const {
  set_active_project
} = projectSlice.actions;
export const {
  update_collaborators
} = collaboratorsSlice.actions;