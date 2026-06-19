import DeckCard from './DeckCard';

export default function CounterColumn({
  counterDecks,
  setCounterDecks,
  selectedDeck,
  setSelectedDeck,
  isAdmin,
}: any) {
  return (
    <div className="centerPanel">
      <h2>카운터덱 구성</h2>

      {(counterDecks || []).map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          heroes={deck.heroes}
          selectedDeck={selectedDeck}
          setSelectedDeck={setSelectedDeck}
          isAdmin={isAdmin}
          onDelete={() => {
            setCounterDecks(counterDecks.filter((d) => d.id !== deck.id));
          }}
          onHeroImageChange={(deckId, imageIndex, imageUrl) => {
            setCounterDecks(
              counterDecks.map((d) => {
                if (d.id !== deckId) return d;

                const updatedHeroes = [...d.heroes];

                updatedHeroes[imageIndex] = imageUrl;

                return {
                  ...d,
                  heroes: updatedHeroes,
                };
              })
            );
          }}
          onTitleChange={(deckId, newTitle) => {
            setCounterDecks(
              counterDecks.map((d) => {
                if (d.id !== deckId) return d;

                return {
                  ...d,
                  title: newTitle,
                };
              })
            );
          }}
          onPositionToggle={(deckId, heroIndex) => {
            setCounterDecks(
              counterDecks.map((d) => {
                if (d.id !== deckId) return d;
          
                const updatedPositions = [
                  ...(d.positions || [
                    'front',
                    'front',
                    'front',
                  ]),
                ];
          
                updatedPositions[heroIndex] =
                  updatedPositions[heroIndex] === 'front'
                    ? 'back'
                    : 'front';
          
                return {
                  ...d,
                  positions: updatedPositions,
                };
              })
            );
          }}
        />
      ))}

      <div
        className="addDeck"
        onClick={() => {
          if (!isAdmin) return;

          setCounterDecks([
            ...counterDecks,

            {
              id: Date.now().toString(),
            
              title: '새 덱',
            
              heroes: [
                '/heroes/hero1.png',
                '/heroes/hero2.png',
                '/heroes/hero3.png',
                '/heroes/pet.png',
              ],
            
              positions: [
                'front',
                'front',
                'front',
              ],
            
              skillOrder: [
                '',
                '',
                '',
              ],
            
              skillNames: [
                '',
                '',
                '',
              ],
            
              tip: '',
            },
          ]);
        }}
      >
        +
      </div>
    </div>
  );
}
