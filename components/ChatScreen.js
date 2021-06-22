import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function ChatScreen({ chat, messages }) {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const [messagesSnapshot] = useCollection(
        db.collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
    );

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map(message => {
                <Message
                    key = {message.id}
                    user = {message.data().user}
                    message = {{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            });
        }
    };

    return (
        <Container>
            <Header>
                <Avatar />

                <HeaderInformation>
                    <h3>Recipient Email</h3>
                    <p>Last Seen...</p>
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* Show messages */}
                {showMessages()}
                <EndOfMessage/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input />
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
    background-color: #e5ddd5;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Header = styled.div`
    position: sticky;
    background-color: #ededed;
    z-index: 100;
    top: 0;
    display:flex;
    padding:11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    >h3{
        margin-bottom: 3px;
    }

    >p {
        font-size: 14px;
        color: gray;
        /* margin-top: 0px; */
    }
`;


const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`

`;

const EndOfMessage = styled.div``;