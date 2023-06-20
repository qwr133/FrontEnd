import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../scss/ConnectLiveChatting.scss';

import '../scss/ConnectGlobalChattingFooter.scss';
import '../scss/ConnectGlobalChattingHeader.scss';
import '../scss/ConnectGlobalChattingMain.scss';
import '../scss/ConnectGlobalChatting.scss';

import ConnectGlobalChatting from './ConnectGlobalChatting';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import { setWebSocket, getWebSocket } from './ConnectWebSocket';

// 함수 -> 태그 -> useEffect

const ConnectLiveChatting = () => {
  const [roomId, setRoomId] = useState(''); // 방 번호
  const [sender, setSender] = useState(''); // 보내는 사람
  const [message, setMessage] = useState(''); // 메시지
  const [messages, setMessages] = useState([]);

  let sock = null;
  let ws = useRef(null);


  // 웹소켓을 연결합니다.
  const connect = () => {

    sock = new SockJS('http://localhost:8181/contents/chat/live');
    ws.current = Stomp.over(sock);

    // 아래 주소로 연결 합니다.
    ws.current.connect(
      {},
      frame => {
        ws.current.subscribe('/topic/chat/room/' + roomId, message => {
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        });
        ws.current.send(
          '/app/chat/message',
          {},
          JSON.stringify({ type: 'ENTER', roomId, sender })
        );
        // TODO : error 처리 해야 함. (연결 실패 시)
        
      }
    )

  };


  // 방 번호가 바뀔때마다 소켓 연결을 다시 해줍니다.
  useEffect(() => {
    // 웹 소켓 연결 함수
    connect();

    return () => {
      ws.current.disconnect();
    };

  }, [roomId]);


  // 메세지를 보내는 함수
  const sendMessage = () => {

    if(!ws.current) {
      alert('npe');
      return;
    }    

    ws.current.send(
      '/app/chat/message',
      {},
      JSON.stringify({ 
        type: 'TALK',
        roomId,
        sender,
        message
      })
    );

    setMessage('');
  };

  
  // 스프링에서 리턴하는 메시지를 받아서 셋팅하는 함수
  const recvMessage = (recv) => {

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: recv.type,
        sender: recv.type === 'ENTER' ? '[알림]' : recv.sender,
        message: recv.message,
      },
    ]);

  };

  // 채팅창을 클릭했을 때
  // 1. 채팅창의 룸 인덱스로 소켓을 연결함
  // 2. 보내는이의 아이디를 유저의 닉네임으로 셋업함
  // 3. div태그를 엽니다.

  const handleClick = (idx) => {
    setRoomId(idx);

    // TODO : 보내는 사람을 해당 유저의 닉네임으로 바꿔야함.
    const name = prompt('닉네임을 입력하세요');
    setSender(name);

    // TODO : 기존의 채팅창에서 다른 방으로 클릭할 때
    // 연결은 되지만 창이 안 열림.
    // open 로직을 수정해야 함
    openChathandler();
  }























    const [isOpenChat, setIsOpenChat] = useState(false);

    // TODO : 채팅창 css 필요.
    const openChathandler = e => {
        // const $chattingBox = document.querySelector('test1234');
        
        // if ($chattingBox.style.height !== '500px') {
        //     $chattingBox.style.animation = 'openGlobalChattingModal 1s forwards 1';
        // } else {
        //     $chattingBox.style.animation = 'none';
        // }
        
        // if ($chattingBox && $chattingBox.style.display !== 'block') {
        //     $chattingBox.style.display = 'block';
        // }
        setIsOpenChat(!isOpenChat);

        // document.addEventListener('mouseup', function(e) {
        //     const container = document.querySelector('test1234');
            
        //     if (container && !container.contains(e.target)) {
        //         container.style.animation = 'closeGlobalChattingModal 1s forwards 1';
        //     } else if (container) {
        //         container.style.display = 'block';
        //     }
        // });

    };

    
    
    





    return (
    <>
    {isOpenChat && 
         (
    <div className='test1234'>
      <div className='lcheader-wrapper'>
      <div className='lcheader-img-box'>
        <div className='lcheader-img'>방장 사진 + 닉네임 들어갈 예정</div>
      </div>
      <div className='lcheader-accessor-box'>
        <div className='lcheader-accessor'>현재 방에 참여한 유저들의 사진 + 닉네임 들어갈 예정</div>
      </div>
    </div>

      {/* main */}
      <div className='lcmain-wrapper'>
        <div className='lcmain-box'>
            <div className='lcmain-chatlist-wrapper'>

              <div className='lcmain-chatlist-header'>이곳이 채팅창</div>
              {messages.map((message) => (
                <li className="list-group-item" style={{listStyle: 'none'}}>
                  <div style={{border: '1px solid red'}}>
                    <div style={{display: 'inline'}}>{message.sender}</div> - <div style={{display: 'inline'}}>{message.message}</div>
                  </div>
                </li>
              ))}

              <div className='lcmain-chatlist-box'>

                <div className='lcmain-chatlist-profile-box'>
                  <div className='lcmain-chatlist-profile'>프로필</div>
                </div>







              </div>
            </div> 
        </div>
      </div>

      {/* footer  */}

      {/* footer 채팅창 */}
      <div className='lcfooter-wrapper'>
        <div className='lcfooter-box'>

          {/* 채팅창 + 전송 버튼 box */}
          <div className='input-text-btn-box'>
            {/* 채팅창 입력 text */}
            <div className='input-text-box'>
              <input 
                type='text'
                className='input-text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                style={{ height: '100px' }}
              />
            {/* 채팅창 전송 버튼 */}
            {/* 채팅창 전송 버튼 box */}
            </div>
            <div className='input-btn-box'>
              {/* 채팅창 전송 버튼 */}
              <button className='input-btn' onClick={sendMessage} style={{ height: '100px' }}></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
    }

        <div className='live-chatting-wrapper'>
        <div className='live-chatting-box'>
          <div className='lc-info-tag-box'>
            <div className='lc-info-box'>

              {/* 게시판 1개 */}
              <button className='lc-info-wrapper' 
              data-value='room1'
              onClick={(e) => handleClick(e.currentTarget.getAttribute('data-value')) }>
                <div className='info-box'>
                  <div className='lc-info-tag-like-reply-box'>
                    <div className='tag-box'>
                      <div className='tag'>
                        <p>#해시태그</p>
                      </div>
                    </div>
                    {/* <div className='like-box'>
                      <div className='like'></div>
                      <p className='count'>100</p>
                    </div>
                    <div className='reply-box'>
                      <div className='reply'></div>
                      <p className='count'>50</p>
                    </div> */}
                  </div>
                  <div className='lc-info-text-img-box'>
                    <div className='text-box'>
                      <div className='info-text'>
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      </div>
                    </div>
                    {/* <div className='img-box'>
                      <div className='info-img'></div>
                    </div> */}
                  </div>
                </div>
              </button>



              {/* 게시판 2개 */}
              <button className='lc-info-wrapper' 
              data-value='room2'
              onClick={(e) => handleClick(e.currentTarget.getAttribute('data-value')) }>
                <div className='info-box'>
                  <div className='lc-info-tag-like-reply-box'>
                    <div className='tag-box'>
                      <div className='tag'>
                        <p>#해시태그</p>
                      </div>
                    </div>
                    {/* <div className='like-box'>
                      <div className='like'></div>
                      <p className='count'>100</p>
                    </div>
                    <div className='reply-box'>
                      <div className='reply'></div>
                      <p className='count'>50</p>
                    </div> */}
                  </div>
                  <div className='lc-info-text-img-box'>
                    <div className='text-box'>
                      <div className='info-text'>
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      </div>
                    </div>
                    {/* <div className='img-box'>
                      <div className='info-img'></div>
                    </div> */}
                  </div>
                </div>
              </button>


              
              {/* 게시판 2개 */}
              <button className='lc-info-wrapper' 
              data-value='room3'
              onClick={(e) => handleClick(e.currentTarget.getAttribute('data-value')) }>
                <div className='info-box'>
                  <div className='lc-info-tag-like-reply-box'>
                    <div className='tag-box'>
                      <div className='tag'>
                        <p>#해시태그</p>
                      </div>
                    </div>
                    {/* <div className='like-box'>
                      <div className='like'></div>
                      <p className='count'>100</p>
                    </div>
                    <div className='reply-box'>
                      <div className='reply'></div>
                      <p className='count'>50</p>
                    </div> */}
                  </div>
                  <div className='lc-info-text-img-box'>
                    <div className='text-box'>
                      <div className='info-text'>
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고 채팅 하실분 고고
                      </div>
                    </div>
                    {/* <div className='img-box'>
                      <div className='info-img'></div>
                    </div> */}
                  </div>
                </div>
              </button>









            </div>

            <div className='lc-tag-wrapper'>
              <ul className='lc-tag-box'>
                <div className='tag-text'>
                  <p>실시간 인기 해시태그</p>
                </div>
                <div className='ic-tag-list-box'>
                  <li className='ic-tag-list'>
                    <p>#1등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#2등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#3등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#4등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#5등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#6등해시태그</p>
                  </li>
                  <li className='ic-tag-list'>
                    <p>#7등해시태그</p>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default ConnectLiveChatting;
