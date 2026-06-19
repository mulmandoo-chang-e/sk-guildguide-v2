import { useRef } from 'react';

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { storage } from '../firebase';

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
  <>
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

    {index < 2 && (
      <div className="skillArrow">→</div>
    )}
  </>
))}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
        
          if (!file) return;
        
          if (
            selectedSkillIndex.current === null
          )
            return;
        
          const storageRef = ref(
            storage,
            `skills/${Date.now()}-${file.name}`
          );
        
          await uploadBytes(
            storageRef,
            file
          );
        
          const imageUrl =
            await getDownloadURL(storageRef);
        
          onSkillImageChange(
            selectedDeck.id,
            selectedSkillIndex.current,
            imageUrl
          );
        }}
      />
    </>
  ) : (
    <div className="emptyGuide">
  덱을 선택하면
  <br />
  상세 정보가 표시됩니다.
</div>
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
            <p
  className="tipContent"
  style={{
    whiteSpace: 'pre-wrap',
  }}
>
  {selectedDeck.tip}
</p>
          )
        ) : (
          <div className="emptyGuide">
  덱을 선택하면
  <br />
  상세 정보가 표시됩니다.
</div>
        )}
      </div>
    </div>
  );
}
