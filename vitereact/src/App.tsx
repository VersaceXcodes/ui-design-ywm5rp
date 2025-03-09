import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* Import shared global views */
import GV_TopNavigation from '@/components/views/GV_TopNavigation.tsx';
import GV_SidebarNavigation from '@/components/views/GV_SidebarNavigation.tsx';
import GV_NotificationsPanel from '@/components/views/GV_NotificationsPanel.tsx';

/* Import unique views */
import UV_Landing from '@/components/views/UV_Landing.tsx';
import UV_SignUp from '@/components/views/UV_SignUp.tsx';
import UV_Login from '@/components/views/UV_Login.tsx';
import UV_PasswordReset from '@/components/views/UV_PasswordReset.tsx';
import UV_Dashboard from '@/components/views/UV_Dashboard.tsx';
import UV_CreateProject from '@/components/views/UV_CreateProject.tsx';
import UV_ProjectDetails from '@/components/views/UV_ProjectDetails.tsx';
import UV_Editor from '@/components/views/UV_Editor.tsx';
import UV_PresentationMode from '@/components/views/UV_PresentationMode.tsx';
import UV_Export from '@/components/views/UV_Export.tsx';
import UV_ProfileSettings from '@/components/views/UV_ProfileSettings.tsx';
import UV_TeamManagement from '@/components/views/UV_TeamManagement.tsx';

/* Import global auth state */
import { RootState } from '@/store/main.tsx';

const App: React.FC = () => {
	const auth = useSelector((state: RootState) => state.auth);
	const location = useLocation();

	// Define authenticated routes paths
	const isAuthenticatedRoute = [
		"/dashboard",
		"/projects/new",
		"/profile",
		"/team-management",
	].some(path => location.pathname.startsWith(path)) ||
	location.pathname.match(/^\/projects\/[^/]+(\/editor|\/share|\/export)?$/);

	// Define where shared components appear
	const showTopNavigation = [
		"/dashboard",
		"/projects/",
	].some(path => location.pathname.startsWith(path));

	const showSidebarNavigation = location.pathname.startsWith("/projects/") && 
		!/\/share|\/export/.test(location.pathname);

	const showNotificationsPanel = [
		"/dashboard",
		"/projects/",
	].some(path => location.pathname.startsWith(path));

	return (
		<>
			{/* Display shared components conditionally */}
			{showTopNavigation && auth && <GV_TopNavigation />}
			<div className="flex">
				{showSidebarNavigation && auth && <GV_SidebarNavigation />}

				<div className="flex-1">
					<Routes>
						{/* Public Routes */}
						<Route path="/" element={<UV_Landing />} />
						<Route path="/signup" element={<UV_SignUp />} />
						<Route path="/login" element={<UV_Login />} />
						<Route path="/password-reset" element={<UV_PasswordReset />} />

						{/* Authenticated Routes */}
						{auth ? (
							<>
								<Route path="/dashboard" element={<UV_Dashboard />} />
								<Route path="/projects/new" element={<UV_CreateProject />} />
								<Route path="/projects/:project_id" element={<UV_ProjectDetails />} />
								<Route path="/projects/:project_id/editor" element={<UV_Editor />} />
								<Route path="/projects/:project_id/share" element={<UV_PresentationMode />} />
								<Route path="/projects/:project_id/export" element={<UV_Export />} />
								<Route path="/profile" element={<UV_ProfileSettings />} />
								<Route path="/team-management" element={<UV_TeamManagement />} />
							</>
						) : (
							// Redirect unauthorized users to login page
							<Route path="*" element={<Navigate to="/login" replace />} />
						)}
					</Routes>
				</div>
			</div>

			{/* Notifications Panel */}
			{showNotificationsPanel && auth && <GV_NotificationsPanel />}
		</>
	);
};

export default App;