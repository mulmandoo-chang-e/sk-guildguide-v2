import { useRef, useState } from 'react';

export default function DeckCard({
  deck,
  heroes,
  selectedDeck,
  setSelectedDeck,
  isAdmin,
  onDelete,
  onHeroImageChange,
  onTitleChange,
}) {
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

          <button className="detailBtn" onClick={() => setSelectedDeck(deck)}>
            상세보기
          </button>
        </div>
      </div>

      <div className="heroRow">
        {heroes.map((hero, index) => (
          <div
            className="heroSlot"
            key={hero}
            onClick={() => {
              if (isAdmin) {
                setSelectedIndex(index);
                fileInputRef.current?.click();
              }
            }}
          >
            <img
              src={deck.heroes[index]}
              alt=""
              className={index === 3 ? 'petIcon' : 'heroIcon'}
            />
          </div>
        ))}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            const imageUrl = URL.createObjectURL(file);

            if (selectedIndex === null) return;

            onHeroImageChange(deck.id, selectedIndex, imageUrl);
          }}
        />
      </div>
    </div>
  );
}
