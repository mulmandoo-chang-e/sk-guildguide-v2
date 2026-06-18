import { useState } from 'react';

export default function DeckList({
  isAdmin,
  setIsAdmin,
  currentPage,
  setCurrentPage,
  guideNames,
  setGuideNames,
  guildName,
  setGuildName,
}) {
  return (
    <div className="leftPanel">
      <div className="logoBox">세나 로고</div>

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

        {guideNames.map((deckName, index) => (
          <div className="deckButtonWrap">
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

        <button className="addButton">+</button>
      </div>

      <div className="bottomButtons">
        <div className="updateDate">
          최종 수정
          <br />
          2026.06.12
        </div>

        <button className="bottomBtn" onClick={() => setIsAdmin(!isAdmin)}>
          {isAdmin ? '관리자 모드' : '로그인'}
        </button>
      </div>
    </div>
  );
}
