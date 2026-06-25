import { useState, useEffect } from 'react';
import DeckCard from './DeckCard';

export default function CounterColumn({
  counterDecks,
  setCounterDecks,
  selectedDeck,
  setSelectedDeck,
  isAdmin,
}: any) {

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {

    if (window.innerWidth < 769) {
      setIsOpen(false);
    }

  }, []);

  return (
    <div className="centerPanel">

      <div className="counterHeader">

        <h2>카운터덱 구성</h2>

        <button
          className="counterToggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▲ 접기' : '▼ 카운터덱 보기'}
        </button>

      </div>

      {isOpen &&
        (counterDecks || []).map((deck: any) => (

          <DeckCard
            key={deck.id}
            deck={deck}
            heroes={deck.heroes}
            selectedDeck={selectedDeck}
            setSelectedDeck={setSelectedDeck}
            isAdmin={isAdmin}

            onDelete={() => {

              setCounterDecks(
                counterDecks.filter(
                  (d: any) => d.id !== deck.id
                )
              );

            }}

            onHeroImageChange={(
              deckId: any,
              imageIndex: any,
              imageUrl: any
            ) => {

              setCounterDecks(

                counterDecks.map((d: any) => {

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

            onTitleChange={(
              deckId: any,
              newTitle: any
            ) => {

              setCounterDecks(

                counterDecks.map((d: any) => {

                  if (d.id !== deckId) return d;

                  return {
                    ...d,
                    title: newTitle,
                  };

                })

              );

            }}

            onPositionToggle={(
              deckId: any,
              heroIndex: any
            ) => {

              setCounterDecks(

                counterDecks.map((d: any) => {

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

    {isOpen && (

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

    )}

  </div>
);
}