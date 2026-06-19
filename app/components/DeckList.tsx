import { useRef } from 'react';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { storage } from '../firebase';

export default function DeckList({
  isAdmin,
  setIsAdmin,
  currentPage,
  setCurrentPage,
  guideNames,
  setGuideNames,
  guildName,
  setGuildName,
  logoImage,
  setLogoImage,
  lastModified,
}: any) {
  const fileInputRef = useRef(null);

  return (
    <div className="leftPanel">
      <div
  className="logoBox"
  onClick={() => {
    if (!isAdmin) return;

    fileInputRef.current?.click();
  }}
>
  {logoImage ? (
    <img
      src={logoImage}
      alt=""
      className="siteLogo"
    />
  ) : (
    '세나 로고'
  )}

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={async (e) => {
      const file = e.target.files?.[0];
    
      if (!file) return;
    
      const storageRef = ref(
        storage,
        `logos/${Date.now()}-${file.name}`
      );
    
      await uploadBytes(
        storageRef,
        file
      );
    
      const imageUrl =
        await getDownloadURL(storageRef);
    
      setLogoImage(imageUrl);
    }}
  />
</div>

      <div className="guildBox">
        <h2>길드전 가이드</h2>

        {isAdmin ? (
  <input
    className="guildInput"
    value={guildName}
    onChange={(e) => setGuildName(e.target.value)}
  />
) : (
  <p>{guildName}</p>
)}
      </div>

      <div className="deckMenu">
        <button className="menuTitle">덱 목록</button>

        {guideNames.map((deckName: any, index: any) => (
  <div
    key={index}
    className="deckButtonWrap"
  >
          {isAdmin ? (
  <input
    className={`deckMenuInput ${
      currentPage === `deck${index + 1}` ? 'activeDeck' : ''
    }`}
    value={deckName}
    onClick={() => setCurrentPage(`deck${index + 1}`)}
    onChange={(e) => {
      const updated = [...guideNames];

      updated[index] = e.target.value;

      setGuideNames(updated);
    }}
  />
) : (
  <button
    className={`deckButton ${
      currentPage === `deck${index + 1}` ? 'activeDeck' : ''
    }`}
    onClick={() => setCurrentPage(`deck${index + 1}`)}
  >
    {deckName}
  </button>
)}
        </div>
        ))}
      </div>

      <div className="bottomButtons">
      <div className="updateDate">
  최종 수정
  <br />
  {lastModified}
</div>

        <button
  className="bottomBtn"
  onClick={() => {
    if (isAdmin) {
      setIsAdmin(false);
      return;
    }

    const password = prompt('비밀번호 입력');

    if (password === '지약새1') {
      setIsAdmin(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  }}
>
  {isAdmin ? '로그아웃' : '로그인'}
</button>
      </div>
    </div>
  );
}
