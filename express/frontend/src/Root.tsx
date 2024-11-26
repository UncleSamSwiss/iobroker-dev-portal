import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import {
	Box,
	Button,
	CSSObject,
	Container,
	CssBaseline,
	Divider,
	IconButton,
	Link,
	AppBar as MuiAppBar,
	AppBarProps as MuiAppBarProps,
	Drawer as MuiDrawer,
	Theme,
	Toolbar,
	Typography,
	styled,
} from "@mui/material";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { GitHubIcon } from "./components/Icons";
import { NavList } from "./components/NavList";
import { ReloadPageSnackbar } from "./components/ReloadPageSnackbar";
import { UserMenu } from "./components/UserMenu";
import { useDrawerContext } from "./contexts/DrawerContext";
import { useUserContext } from "./contexts/UserContext";
import { GIT_BRANCH, GIT_COMMIT } from "./version";

const drawerWidth = 240;

export function handleLogin() {
	if (window.location.port === "3000") {
		alert(
			"Login is not supported in local development mode, please use docker-compose to test login",
		);
	} else {
		const url = encodeURIComponent(window.location.pathname);
		window.location.href = `/login?redirect=${url}`;
	}
}

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
});

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["width", "margin"], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	variants: [
		{
			props: ({ open }) => open,
			style: {
				...openedMixin(theme),
				"& .MuiDrawer-paper": openedMixin(theme),
			},
		},
		{
			props: ({ open }) => !open,
			style: {
				...closedMixin(theme),
				"& .MuiDrawer-paper": closedMixin(theme),
			},
		},
	],
}));

export function Root() {
	const { user, isReady, logout } = useUserContext();
	const { isOpen, toggle } = useDrawerContext();

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<ReloadPageSnackbar />
			<AppBar
				position="fixed"
				/*sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					transition: (theme) =>
						theme.transitions.create(["width", "margin"], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
					marginLeft: drawerWidth,
					width: open ? `calc(100% - ${drawerWidth})` : undefined,
				}}*/
				open={isOpen}
			>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={toggle}
						sx={{
							marginRight: 5,
							display: {
								xs: "none",
								sm: isOpen ? "none" : "block",
							},
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						color="inherit"
						noWrap
						sx={{ flexGrow: 1 }}
					>
						<Link
							component={RouterLink}
							to="/"
							color="inherit"
							underline="hover"
						>
							ioBroker Developer Portal
						</Link>
					</Typography>
					{!user && (
						<Button
							color="inherit"
							startIcon={<GitHubIcon />}
							onClick={handleLogin}
						>
							Login
						</Button>
					)}
					{user && <UserMenu user={user} onLogout={logout} />}
				</Toolbar>
			</AppBar>
			{isReady && (
				<>
					<Drawer
						variant="permanent"
						sx={
							{
								/*position: "relative",
							whiteSpace: "nowrap",
							width: (theme) =>
								open ? drawerWidth : theme.spacing(7),
							overflowX: "hidden",
							transition: (theme) =>
								theme.transitions.create("width", {
									easing: theme.transitions.easing.sharp,
									duration:
										theme.transitions.duration
											.enteringScreen,
								}),
							display: {
								xs: "none",
								sm: "block",
							},*/
							}
						}
						open={isOpen}
					>
						<Box
							sx={(theme) => ({
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								padding: "0 8px",
								...theme.mixins.toolbar,
							})}
						>
							<IconButton onClick={toggle}>
								<ChevronLeftIcon />
							</IconButton>
						</Box>
						<Divider />
						<NavList />
						{isOpen && (
							<Box
								sx={{
									position: "absolute",
									bottom: "0px",
									color: "#ccc",
									padding: (theme) => theme.spacing(1),
								}}
							>
								{GIT_COMMIT}@{GIT_BRANCH}
							</Box>
						)}
					</Drawer>
					<Box
						sx={{
							flexGrow: 1,
							height: "100vh",
							overflowY: "scroll",
						}}
					>
						<Box sx={(theme) => theme.mixins.toolbar} />
						<Container
							maxWidth="lg"
							sx={(theme) => ({
								paddingTop: theme.spacing(4),
								paddingBottom: theme.spacing(4),
							})}
						>
							<Outlet />
						</Container>
					</Box>
				</>
			)}
		</Box>
	);
}
