import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/chat";
import AddIcon from '@material-ui/icons/Add';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddCommentIcon from '@material-ui/icons/AddComment';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {

	const [user] = useAuthState(auth);
	const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
	const [chatsSnapshot] = useCollection(userChatRef);


	const createChat = () => {
		const input = prompt("Please enter the email address");
		if(!input) 
			return null;
		if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
			// We need to add the chat into the DB "chats" collection
			db.collection("chats").add({ 
				users: [user.email, input],
			});
		}
	};

	const chatAlreadyExists = (recipientEmail) => {
		return !!chatsSnapshot?.docs.find(
			(chat) => chat.data().users.find( 
				(user) => user === recipientEmail)?.length > 0
		);
	};

    return (
        <Container>
			<HeaderSearchStart>
				<Header>
					<UserAvatar 
						onClick = { () => auth.signOut() }
						src = {user.photoURL}
					/>
					
					<IconsContainer>

						<IconButton>
							<AddIcon onClick = {createChat} color = "#00bfa5"/>
						</IconButton>

						<IconButton>
							<MoreHorizIcon/>
						</IconButton>
						
					</IconsContainer>
				</Header>

				<Search>
					<IconPlusInput>
						<SearchIcon />
						<SearchInput placeholder = "Search"/>
					</IconPlusInput>
				</Search>
			</HeaderSearchStart>

			{/* list of chats */}
			{chatsSnapshot?.docs.map((chat) =>{
				// console.log(chat.data().users);
				return(
					<Chat 
						key = {chat.id} 
						id = {chat.id} 
						users = {chat.data().users} 
					/>
				);
			})}


		</Container>
    );
}

export default Sidebar;

const Container = styled.div`
	overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: 0px;
`;

const HeaderSearchStart = styled.div`
	display: flex;
	flex-direction: column;
	position: sticky;
	z-index: 1;
	top : 0;
	background-color: #00bfa5;
`;

const IconPlusInput = styled.div`
	display: flex;
	background-color: white;
	border-radius: 40px;
	flex: 1;
	padding: 5px;
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 2px;
	background-color: #f6f6f6;
	border-bottom: 1px solid #dfdfdf;
`;

const SidebarButton = styled(Button)`
	width: 100%;
	background-color: #00bfa5;
	&&& {
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid #dfdfdf;
	}
	
`;

const SearchInput = styled.input`
	outline-width: 0;
	border: none;
	padding-left: 10px;
	/* flex: 1; */
	/* border-radius: 40px; */
`;

const Header = styled.div`
	display: flex;
	/* position: sticky; */
	top: 0;
	background-color: #ededed;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
	border-right : 1px solid #dfdfdf;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover{
		opacity: 0.8;
	}
`;

const IconsContainer = styled.div``;
