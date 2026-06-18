import { useRef } from 'react';

export default function DetailPanel({
  selectedDeck,
  isAdmin,
  onTipChange,
  onSkillImageChange,
  onSkillNameChange,
}) {
  const fileInputRef = useRef(null);
const selectedSkillIndex = useRef(null);
  return (
    <div className="panel detailPanel">
      <h2>상세 정보</h2>

      <div className="skillBox">
  <h3>스킬 순서</h3>

  {selectedDeck ? (
    <>
      <div className="skillRow">
        {selectedDeck.skillOrder.map((skill, index) => (
          <div className="skillItem" key={index}>
            <div
              className="skillSlot"
              onClick={() => {
                if (!isAdmin) return;

                selectedSkillIndex.current = index;
                fileInputRef.current?.click();
              }}
            >
              {skill ? (
                <img
                  src={skill}
                  alt=""
                  className="skillIcon"
                />
              ) : null}
            </div>

            <input
              className="skillNameInput"
              value={
                selectedDeck.skillNames?.[index] || ''
              }
              placeholder="스킬명"
              onChange={(e) =>
                onSkillNameChange(
                  selectedDeck.id,
                  index,
                  e.target.value
                )
              }
            />
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          const imageUrl =
            URL.createObjectURL(file);

          if (
            selectedSkillIndex.current === null
          )
            return;

          onSkillImageChange(
            selectedDeck.id,
            selectedSkillIndex.current,
            imageUrl
          );
        }}
      />
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
