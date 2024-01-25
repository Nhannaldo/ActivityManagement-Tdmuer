import React, { useState } from 'react';
import classNames from 'classnames/bind';
import style from './ChatBox.module.scss';
import UserChatComp from './UserChat/UserChatComp';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSearch, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import Modal from '../Modal/Modal';
import Button from '../Button';
import Tippy from '@tippyjs/react/headless';
import debounce from 'lodash/debounce';
import 'tippy.js/dist/tippy.css'; // optional
import { Wrapper as PopperWrapper } from '~/components/Popper';
import UserGroup from '../User/UserGroup';
const cx = classNames.bind(style);

function ChatBox() {
    const [isActive, setIsActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    //user add null
    const [arrUsers, setArrUsers] = useState([]);
    const [arrUsersAdded, setArrUsersAdded] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [keywordsGroup, setKeywordsGroup] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupChats, setGroupChats] = useState([]);
    //new
    

    //search for modal: dữ liệu mẫu
    const users = [
        {
            id: 1,
            name: 'Đặng Việt Quang',
            url: 'https://scontent.fsgn16-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeFnEOx_iCrEN1BhO4MnlIbkBpAxb8EGZxkGkDFvwQZnGfWXayXTM9FKrFw1vb1NC1X25ef1CxXJsGEB71ymuTqg&_nc_ohc=fzl5m2gILNUAX9RU0QY&_nc_ht=scontent.fsgn16-1.fna&oh=00_AfCFWPWUNHO1PdBxQkzKN_kRjMapsF0MBWydCt1xz35Oww&oe=65B487E2',
        },
        {
            id: 2,
            name: 'Trần Thành Nam',
            url: 'https://scontent-xsp1-1.xx.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=2b6aad&_nc_eui2=AeENu2ttvDjT_gtjEq4oiER6so2H55p0AlGyjYfnmnQCUXaVpbzFVNwqGQoLRzNiOJ4aRzEjVAXyZhSy4TRZ4f9R&_nc_ohc=KFZOL86TwZkAX-5B922&_nc_ht=scontent-xsp1-1.xx&oh=00_AfBR7eBVMOUIFZF039eEzbBVevg6GmIEVuiUXJW0oUUWwg&oe=65C2F138',
        },
        {
            id: 3,
            name: 'Nguyễn Nhân',
            url: 'https://scontent-xsp1-2.xx.fbcdn.net/v/t1.6435-1/102326557_658139238246076_1608374780314545293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-7&_nc_sid=2b6aad&_nc_eui2=AeFlu3bTPshZoyT0GglCApcdemJ9vLmBp6t6Yn28uYGnq8RpuvhFUMEXHrR64AnRQUsz5qKLfWAyyF5v6084Mrdq&_nc_ohc=UulVeIPC5pIAX9fWENu&_nc_ht=scontent-xsp1-2.xx&oh=00_AfCsUWmfRn8GqxkXI0fFKfj7zhKZHvauc16nF-FvKnpLgg&oe=65C2EA95',
        },
        // {
        //     id: 4,
        //     name: 'Trần Nguyễn Gia Phúc',
        //     url: 'https://scontent-xsp1-3.xx.fbcdn.net/v/t39.30808-1/273888485_1330651314101959_2643757613876285297_n.jpg?stp=dst-jpg_p320x320&_nc_cat=100&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeGa0V5cBTGn3qY-4u-QJ7lGeVWYCRoxlM55VZgJGjGUzvpcwzrjPQnXd3ehlwWzRvV4FqMZyqbo8nHM1uOHFec3&_nc_ohc=ljr5SIXEmGEAX9s_Mo2&_nc_ht=scontent-xsp1-3.xx&oh=00_AfDTyblS5_ZoN5pTushMjHplPxn3ayt1WUDgeuh_onQwhQ&oe=65A1561D',
        // },
        // {
        //     id: 5,
        //     name: 'Nguyễn Đức Nhân',
        //     url: 'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
        // },
        // {
        //     id: 6,
        //     name: 'Nguyễn Thúy An',
        //     url: 'https://scontent-xsp1-2.xx.fbcdn.net/v/t39.30808-1/416323643_762292415939747_877860037475857663_n.jpg?stp=dst-jpg_s320x320&_nc_cat=102&ccb=1-7&_nc_sid=5740b7&_nc_eui2=AeFWssJp4uxPB3vRGzh1p4nR9PSZoO3b1_D09Jmg7dvX8CRVzrjyN13gJDO3HaNhEwYIGRjNH4oso8Y1tlBFk16X&_nc_ohc=zOtzvj6KOL0AX_p-uHs&_nc_ht=scontent-xsp1-2.xx&oh=00_AfAaKSAD89luloxCAVHkeSq68xi2r1rDgNXFyNkLUKuONw&oe=65A0F558',
        // },
    ];
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [filteredUsersGroup, setFilteredUsersGroup] = useState(users);
    // function search user
    const searchUsers = (keywords) => {
        if (keywords.trim() !== '') {
            const filteredUsers = users.filter((user) => {
                return (
                    !arrUsersAdded.find((addedUser) => addedUser.id === user.id) &&
                    (user.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        user.name.toLowerCase().startsWith(keywords.toLowerCase()))
                );
            });
            setFilteredUsers(filteredUsers);
        } else {
            // Nếu không có từ khóa, hiển thị toàn bộ danh sách người dùng
            setFilteredUsers(users);
        }
    };
    // Thay đổi phần cập nhật filteredUsersGroup
    const searchUsersGroup = (keywords) => {
        if (keywords.trim() !== '') {
            const filteredUsersGroup = users.filter((user) => {
                return (
                    !arrUsersAdded.find((addedUser) => addedUser.id === user.id) &&
                    (user.name.toLowerCase().includes(keywords.toLowerCase()) ||
                        user.name.toLowerCase().startsWith(keywords.toLowerCase()))
                );
            });
            setFilteredUsersGroup(filteredUsersGroup);
        } else {
            // Nếu không có từ khóa, hiển thị toàn bộ danh sách người dùng
            setFilteredUsersGroup(users);
        }
    };

    // add users to list
    const addToArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => [...prevArrUsersAdded, user]);
        setKeywordsGroup('');
    };
    //deleted user added
    const removeFromArrUsersAdded = (user) => {
        setArrUsersAdded((prevArrUsersAdded) => prevArrUsersAdded.filter((u) => u.id !== user.id));
    };
   

    const handleInputChange = (e) => {
        const { value } = e.target;
        setKeywords(value);
        // Gọi hàm tìm kiếm với debounce

    };
    const handleInputChangeGroup = (e) => {
        const { value } = e.target;
        setKeywordsGroup(value);
        // Gọi hàm tìm kiếm với debounce

    };
    // Tạo nhóm chat
    const [isGroupCreated, setIsGroupCreated] = useState(false);

    // ... (các hàm và sự kiện khác trước đó)

    // Tạo nhóm chat
    const createGroupChat = () => {
        // ... (các xử lý tạo nhóm chat)

        // Lưu thông tin nhóm chat vào state
        const newGroup = {
            id: String(Date.now()), // Tạo một id duy nhất cho nhóm chat
            name: groupName,
            members: arrUsersAdded,
            // Các thông tin khác nếu cần
        };

        // Thêm nhóm chat mới vào danh sách nhóm chat
        setGroupChats((prevGroupChats) => [...prevGroupChats, newGroup]);

        // Đóng modal và làm sạch trạng thái
        setModalOpen(false);
        setArrUsersAdded([]);
        setKeywords('');
        setGroupName('');

        // Cập nhật danh sách người dùng sau khi tạo nhóm
        updateFilteredUsers();

        // Đánh dấu rằng đã có nhóm chat mới được tạo
        setIsGroupCreated(true);
    };
    // Cập nhật danh sách người dùng
    const updateFilteredUsers = () => {
        // Thực hiện các xử lý cần thiết để cập nhật danh sách người dùng
        // Ví dụ: Gọi API để lấy danh sách người dùng từ server
    
        // Chỉ thêm các thành viên mới vào danh sách người dùng
        const updatedUsers = arrUsersAdded.filter(
            (addedUser) => !filteredUsers.find((user) => user.id === addedUser.id)
        );
    
        setFilteredUsers([...filteredUsers, ...updatedUsers]);
    };

    // modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const handleClick = () => {
        setIsActive(!isActive);
    };
    //test giao diện
    const [selectedUser, setSelectedUser] = useState({
        name: 'Đặng Việt Quang',
        imageUrl:
            'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
    });

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn chặn việc thêm dòng mới vào input
            handleSendMessage();
        }
    };
    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const newMessageObj = {
                id: String(Date.now()),
                content: newMessage,
                timestamp: new Date().getTime(),
                sender: {
                    name: 'Đặng Việt Quang',
                    imageUrl:
                        'https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-1/378393423_1307195950164637_4310189808608344293_n.jpg?stp=dst-jpg_p320x320&_nc_cat=111&ccb=1-7&_nc_sid=5740b7&_nc_ohc=qidZAFIJwWMAX91ujIV&_nc_oc=AQkn_EYpnJOyZI1QRuDQ1Fn6G3Cekfumfr-g4PLK5xca1AZik2eiKWo7kwlFxhP_l8o&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCgVGSawwBMnZC7cZGq0f3zBJuXeX7mYxjemzLLpDBlZA&oe=659AD2A2',
                },
            };

            setMessages((prevMessages) => [...prevMessages, newMessageObj]);
            setNewMessage('');
        }
    };
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setSelectedUserId(user.id);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side-box-chat')}>
                <h2>Đoạn chat</h2>
                <div className={cx('wrap-btn')}>
                <div className={cx('wrap-search')}>
                <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} />
                <input
                    className={cx('input-search')}
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={keywords}
                    onChange={(e) => {
                        handleInputChange(e);
                        searchUsers(e.target.value);
                    }}
                />
                
                </div>
                    <button className={cx('btn-plus')} onClick={openModal}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                </div>

                <div className={cx('wrap-all-user')}>
                    {/* Hiển thị danh sách người dùng */}
                    {filteredUsers.map((user) => (
                        <UserChatComp
                            key={user.id}
                            imageUrl={user.url}
                            name={user.name}
                            lastMessage={'Chúc ngủ ngon'}
                            onUserClick={() => handleUserSelect(user)}
                            isActive={user.id === selectedUserId}
                        />
                    ))}

                    {/* Hiển thị danh sách nhóm chat */}
                    {groupChats.map((groupChat) => (
                        <UserChatComp
                            key={groupChat.id} // Đảm bảo key là duy nhất
                            imageUrl={groupChat.members[0].url} // Sử dụng avatar của thành viên đầu tiên làm hình ảnh nhóm
                            name={groupChat.name}
                            lastMessage={`Nhóm mới tạo: ${groupChat.members.map(member => member.name).join(', ')}`}
                            onUserClick={()=>handleUserSelect(groupChat)}
                            isActive={isGroupCreated && groupChat.id === groupChats[groupChats.length - 1].id}
                        />
                    ))}
                </div>
                
            </div>
            <div className={cx('right-side-chat-box')}>
                {selectedUser && (
                    <div className={cx('header-chat')}>
                        <img className={cx('img-header-chat')} src={selectedUser.imageUrl} alt="" />
                        <h2 className={cx('name-header-chat')}>{selectedUser.name}</h2>
                    </div>
                )}
                <div className={cx('content-chat')}>
                    {messages.map((message) => (
                        <div key={message.id} className={cx('message')}>
                            <div className={cx('sender-details')}>
                                <img
                                    className={cx('img-sender')}
                                    src={message.sender.imageUrl}
                                    alt={`${message.sender.name}'s avatar`}
                                />
                                <span className={cx('name-sender')}>{message.sender.name}</span>
                                <div className={cx('sender-info')}>
                                    {`Sent ${formatDistanceToNow(message.timestamp, { addSuffix: true })}`}
                                </div>
                            </div>
                            {message.content}
                        </div>
                    ))}
                </div>
                <div className={cx('footer-chat')}>
                    <button className={cx('btn-footer')}>
                        <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className={cx('input-footer')}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className={cx('btn-footer')} onClick={handleSendMessage}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
            {modalOpen && (
                <Modal onClose={closeModal}>
                    <div className={cx('wrap-modal')}>
                        <h2 className={cx('title')}>Thêm nhóm chat mới</h2>
                        <Tippy
                            visible={keywordsGroup.length > 0}
                            interactive
                            placement="bottom"
                            render={(attrs) => (
                                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                                    <PopperWrapper>
                                        {filteredUsersGroup.map((user) => (
                                            <UserGroup
                                                key={user.id}
                                                imgURL={user.url}
                                                name={user.name}
                                                onAdd={() => addToArrUsersAdded(user)}
                                            />
                                        ))}
                                    </PopperWrapper>
                                </div>
                            )}
                        >
                            <div className={cx('modal-wrap-input')}>
                                <FontAwesomeIcon icon={faSearch} className={cx('icon-search')} onClick={searchUsersGroup}/>
                                <input
                                    type="text"
                                    value={keywordsGroup}
                                    onChange={handleInputChangeGroup}
                                    placeholder="Nhập người dùng muốn thêm"
                                    className={cx('input-search')}
                                />
                            </div>
                        </Tippy>
                        <h4 className={cx('title-add')}>Người dùng đã thêm</h4>
                        <div className={cx('wrap-user-added')}>
                            {arrUsersAdded.map((user) => (
                                <UserGroup
                                    key={user.id}
                                    imgURL={user.url}
                                    name={user.name}
                                    btn
                                    isAdded
                                    onDelete={() => removeFromArrUsersAdded(user)}
                                />
                            ))}
                        </div>
                        <div className={cx('modal-wrap-input')}>
                            <FontAwesomeIcon icon={faUsers} className={cx('icon-search')} />
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)} 
                                placeholder="Nhập tên nhóm mới"
                                className={cx('input-search')}
                            />
                        </div>
                        <Button outline className={cx('btn-submit')} onClick={createGroupChat}>
                            Tạo nhóm
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ChatBox;
