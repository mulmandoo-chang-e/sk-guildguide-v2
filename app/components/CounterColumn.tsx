import DeckCard from './DeckCard';

export default function CounterColumn({
  counterDecks,
  setCounterDecks,
  selectedDeck,
  setSelectedDeck,
  isAdmin,
}) {
  return (
    <div className="centerPanel">
      <h2>카운터덱 구성</h2>

      {counterDecks.map((deck) => (
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

              title: '새 카운터',

              heroes: [
                '/heroes/hero1.png',
                '/heroes/hero2.png',
                '/heroes/hero3.png',
                '/heroes/pet.png',
              ],

              skillOrder: [],

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
