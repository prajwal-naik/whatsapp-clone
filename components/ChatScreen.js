import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState, useRef } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {

    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const router = useRouter();
    const endOfMessageRef = useRef(null);
    const [messagesSnapshot] = useCollection(
        db.collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
    );

    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map(message => {
                return(
                    <Message
                        key = {message.id}
                        user = {message.data().user}
                        message = {{
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime(),
                        }}
                    />
                );
            });
        }
        else{ //pass server rendered messages
            return JSON.parse(messages).map((message) => {
                return (
                    <Message
                        key = {message.id}
                        user = {message.user}
                        message = {message}
                    />
                );
            });
        }
    };

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behvaiour: "smooth",
            block: "start",
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {
                    recipient? (
                        <Avatar src = {recipient?.photoURL}/>
                    )
                    :
                    (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot?
                        (
                            <p>Last seen: {" "}
                            {
                                recipient?.lastSeen?.toDate()?(
                                <TimeAgo datetime = {recipient?.lastSeen?.toDate()}/>
                                )
                                : 
                                "Unavailable"
                            }
                            </p>
                        ): (
                            <p>Loading last active...</p>
                        )
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* Show messages */}
                {showMessages()}
                <EndOfMessage ref = {endOfMessageRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value = {input} onChange={e => setInput(e.target.value)}/>
                <button hidden 
                    disabled = {!input} 
                    type = "submit" 
                    onClick={sendMessage}
                >
                    Send Message
                </button>
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
    border-radius: 40px;
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
    background-color: #ededed;
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

    > h3{
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
        /* margin-top: 0px; */
    }
`;


const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;