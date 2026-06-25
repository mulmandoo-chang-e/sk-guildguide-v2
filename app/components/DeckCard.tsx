import { useRef, useState } from 'react';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { storage } from '../firebase';

export default function DeckCard({
  deck,
  heroes,
  selectedDeck,
  setSelectedDeck,
  isAdmin,
  onDelete,
  onHeroImageChange,
  onTitleChange,
  onPositionToggle,
}: any) {
  const isActive = selectedDeck?.id === deck.id;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className={`deckCard ${isActive ? 'activeDeck' : ''}`}>
      <div className="deckHeader">
        {isAdmin ? (
          <input
            className="deckTitleInput"
            value={deck.title}
            onChange={(e) => onTitleChange(deck.id, e.target.value)}
          />
        ) : (
          <h3>{deck.title}</h3>
        )}

        <div className="headerButtons">
          {isAdmin && (
            <button className="deleteBtn" onClick={onDelete}>
              삭제
            </button>
          )}

<button
  className="detailBtn"
  onClick={() => {
    setSelectedDeck(deck);

    if (window.innerWidth <= 768) {
      setTimeout(() => {
        document
          .querySelector('.detailPanel')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
      }, 50);
    }
  }}
>
  상세보기
</button>
        </div>
      </div>

      <div className="heroRow">
  {heroes.map((hero: any, index: any) => (
    <div
      className={`heroSlot ${
        index !== 3
          ? deck.positions?.[index] === 'back'
            ? 'backHero'
            : 'frontHero'
          : ''
      }`}
      key={hero}
      onClick={() => {
        if (isAdmin) {
          setSelectedIndex(index);
          fileInputRef.current?.click();
        }
      }}
    >
      {isAdmin && index !== 3 && (
        <div
        className="positionDot"
        onClick={(e) => {
          e.stopPropagation();
      
          if (!isAdmin) return;
      
          onPositionToggle(
            deck.id,
            index
          );
        }}
      >
          {deck.positions?.[index] === 'back'
            ? '🔴'
            : '🔵'}
        </div>
      )}

      <img
        src={deck.heroes[index]}
        alt=""
        className={
          index === 3
            ? 'petIcon'
            : 'heroIcon'
        }
      />
    </div>
  ))}

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={async (e) => {
      const file = e.target.files?.[0];
    
      if (!file) return;
    
      if (selectedIndex === null) return;
    
      const storageRef = ref(
        storage,
        `heroes/${Date.now()}-${file.name}`
      );
    
      await uploadBytes(
        storageRef,
        file
      );
    
      const imageUrl =
        await getDownloadURL(storageRef);
    
      onHeroImageChange(
        deck.id,
        selectedIndex,
        imageUrl
      );
    }}
  />
</div>
    </div>
  );
}
