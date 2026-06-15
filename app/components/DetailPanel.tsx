export default function DetailPanel({ selectedDeck, isAdmin, onTipChange }) {
  return (
    <div className="panel detailPanel">
      <h2>상세 정보</h2>

      <div className="skillBox">
        <h3>스킬 순서</h3>

        {selectedDeck ? (
          <>
            <div className="skillRow">
              {selectedDeck.skillOrder.map((skill) => (
                <img key={skill} src={skill} alt="" className="skillIcon" />
              ))}
            </div>
          </>
        ) : (
          <p>덱을 선택해주세요.</p>
        )}
      </div>

      <div className="tipBox">
        <h3>장비 세팅 & TIP</h3>

        {selectedDeck ? (
          isAdmin ? (
            <>
              <textarea
                value={selectedDeck.tip}
                className="tipEditor"
                onChange={(e) => onTipChange(selectedDeck.id, e.target.value)}
              />

              <button className="saveBtn">저장</button>
            </>
          ) : (
            <p>{selectedDeck.tip}</p>
          )
        ) : (
          <p>덱을 선택해주세요.</p>
        )}
      </div>
    </div>
  );
}
