export default function DeckList({
  isAdmin,
  setIsAdmin,
  currentPage,
  setCurrentPage,
}) {
  return (
    <div className="leftPanel">
      <div className="logoBox">세나 로고</div>

      <div className="guildBox">
        <h2>길드전 가이드</h2>

        {isAdmin ? (
          <input className="guildInput" defaultValue="길드 이름" />
        ) : (
          <p>길드 이름</p>
        )}
      </div>

      <div className="deckMenu">
        <button className="menuTitle">덱 목록</button>

        {['덱 1', '덱 2', '덱 3', '덱 4'].map((deckName) => (
          <div className="deckButtonWrap">
            {isAdmin ? (
              <input className="deckMenuInput" defaultValue={deckName} />
            ) : (
              <button
                className="deckButton"
                onClick={() =>
                  setCurrentPage(
                    deckName === '덱 1'
                      ? 'deck1'
                      : deckName === '덱 2'
                      ? 'deck2'
                      : deckName === '덱 3'
                      ? 'deck3'
                      : 'deck4'
                  )
                }
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
