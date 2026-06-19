'use client';

import { useEffect, useState } from 'react';

import { ref, set, get } from 'firebase/database';

import { db } from './firebase';

import DeckList from './components/DeckList';
import DefenseColumn from './components/DefenseColumn';
import CounterColumn from './components/CounterColumn';
import DetailPanel from './components/DetailPanel';

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_PASSWORD = '지약새1';
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentPage, setCurrentPage] = useState('deck1');
  const [deckPages, setDeckPages] = useState(() => {
    const saved = localStorage.getItem('deckPages');
  
    if (saved) {
      return JSON.parse(saved);
    }
  
    return {
      deck1: {
        defenseDecks: [],
        counterDecks: [],
      },
  
      deck2: {
        defenseDecks: [],
        counterDecks: [],
      },
  
      deck3: {
        defenseDecks: [],
        counterDecks: [],
      },
  
      deck4: {
        defenseDecks: [],
        counterDecks: [],
      },
    };
  });
  const [guideNames, setGuideNames] = useState(() => {
    const saved = localStorage.getItem('guideNames');
  
    if (saved) {
      return JSON.parse(saved);
    }
  
    return ['덱 1', '덱 2', '덱 3', '덱 4'];
  });
  
  const [guildName, setGuildName] = useState(() => {
    const saved = localStorage.getItem('guildName');
  
    if (saved) {
      return saved;
    }
  
    return '길드 이름';
  });

  const [lastModified, setLastModified] = useState(() => {
    const saved = localStorage.getItem('lastModified');
  
    if (saved) {
      return saved;
    }
  
    return new Date().toLocaleDateString('ko-KR');
  });

  const [logoImage, setLogoImage] = useState(() => {
    const saved = localStorage.getItem('logoImage');
  
    if (saved) {
      return saved;
    }
  
    return '';
  });
  
  const [defenseDecks, setDefenseDecks] = useState(() => {
    const saved = localStorage.getItem('defenseDecks');

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 'defense1',
        title: '라오엘 공격형',
        heroes: [
          '/heroes/hero1.png',
          '/heroes/hero2.png',
          '/heroes/hero3.png',
          '/heroes/pet.png',
        ],
        skillOrder: [
          '/skills/skill1.png',
          '/skills/skill2.png',
          '/skills/skill3.png',
        ],
        tip: '라오엘 먼저 제거',
      },
    ];
  });
  const [counterDecks, setCounterDecks] = useState(() => {
    const saved = localStorage.getItem('counterDecks');

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 'counter1',
        title: '카운터1',
        heroes: [
          '/heroes/hero1.png',
          '/heroes/hero2.png',
          '/heroes/hero3.png',
          '/heroes/pet.png',
        ],
        skillOrder: [
          '/skills/skill1.png',
          '/skills/skill2.png',
          '/skills/skill3.png',
        ],
        tip: '',
      },
    ];
  });

  const onTipChange = (deckId, newTip) => {
    setDeckPages((prev) => ({
      ...prev,
  
      [currentPage]: {
        ...prev[currentPage],
  
        defenseDecks: prev[currentPage].defenseDecks.map((d) =>
          d.id === deckId ? { ...d, tip: newTip } : d
        ),
  
        counterDecks: prev[currentPage].counterDecks.map((d) =>
          d.id === deckId ? { ...d, tip: newTip } : d
        ),
      },
    }));
  
    if (selectedDeck?.id === deckId) {
      setSelectedDeck({
        ...selectedDeck,
        tip: newTip,
      });
    }
    setLastModified(
      new Date().toLocaleDateString('ko-KR')
    );
  };

  const onSkillImageChange = (
    deckId,
    skillIndex,
    imageUrl
  ) => {
    setDeckPages((prev) => ({
      ...prev,
  
      [currentPage]: {
        ...prev[currentPage],
  
        defenseDecks: prev[currentPage].defenseDecks.map((d) => {
          if (d.id !== deckId) return d;
  
          const updatedSkills = [...d.skillOrder];
  
          updatedSkills[skillIndex] = imageUrl;
  
          return {
            ...d,
            skillOrder: updatedSkills,
          };
        }),
  
        counterDecks: prev[currentPage].counterDecks.map((d) => {
          if (d.id !== deckId) return d;
  
          const updatedSkills = [...d.skillOrder];
  
          updatedSkills[skillIndex] = imageUrl;
  
          return {
            ...d,
            skillOrder: updatedSkills,
          };
        }),
      },
    }));
  
    if (selectedDeck?.id === deckId) {
      const updatedSkills = [...selectedDeck.skillOrder];
  
      updatedSkills[skillIndex] = imageUrl;
  
      setSelectedDeck({
        ...selectedDeck,
        skillOrder: updatedSkills,
      });
    }
    setLastModified(
      new Date().toLocaleDateString('ko-KR')
    );
  };

  const onSkillNameChange = (
    deckId,
    skillIndex,
    newName
  ) => {
    setDeckPages((prev) => ({
      ...prev,
  
      [currentPage]: {
        ...prev[currentPage],
  
        defenseDecks: prev[currentPage].defenseDecks.map((d) => {
          if (d.id !== deckId) return d;
  
          const updatedNames = [
            ...(d.skillNames || ['', '', '']),
          ];
  
          updatedNames[skillIndex] = newName;
  
          return {
            ...d,
            skillNames: updatedNames,
          };
        }),
  
        counterDecks: prev[currentPage].counterDecks.map((d) => {
          if (d.id !== deckId) return d;
  
          const updatedNames = [
            ...(d.skillNames || ['', '', '']),
          ];
  
          updatedNames[skillIndex] = newName;
  
          return {
            ...d,
            skillNames: updatedNames,
          };
        }),
      },
    }));
  
    if (selectedDeck?.id === deckId) {
      const updatedNames = [
        ...(selectedDeck.skillNames || ['', '', '']),
      ];
    
      updatedNames[skillIndex] = newName;
    
      setSelectedDeck({
        ...selectedDeck,
        skillNames: updatedNames,
      });
    }
    
    setLastModified(
      new Date().toLocaleDateString('ko-KR')
    );
  };
  useEffect(() => {
    const loadFirebaseData = async () => {
      const snapshot = await get(
        ref(db, 'guildData')
      );
  
      if (!snapshot.exists()) return;
  
      const data = snapshot.val();
  
      if (data.deckPages) {
        setDeckPages({
          deck1: {
            defenseDecks:
              data.deckPages.deck1?.defenseDecks || [],
            counterDecks:
              data.deckPages.deck1?.counterDecks || [],
          },
      
          deck2: {
            defenseDecks:
              data.deckPages.deck2?.defenseDecks || [],
            counterDecks:
              data.deckPages.deck2?.counterDecks || [],
          },
      
          deck3: {
            defenseDecks:
              data.deckPages.deck3?.defenseDecks || [],
            counterDecks:
              data.deckPages.deck3?.counterDecks || [],
          },
      
          deck4: {
            defenseDecks:
              data.deckPages.deck4?.defenseDecks || [],
            counterDecks:
              data.deckPages.deck4?.counterDecks || [],
          },
        });
      }
  
      if (data.guideNames)
        setGuideNames(data.guideNames);
  
      if (data.guildName)
        setGuildName(data.guildName);
  
      if (data.lastModified)
        setLastModified(data.lastModified);
  
      if (data.logoImage)
        setLogoImage(data.logoImage);
      
        setIsLoaded(true);
    };
  
    loadFirebaseData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(
      'deckPages',
      JSON.stringify(deckPages)
    );
  
    localStorage.setItem(
      'guideNames',
      JSON.stringify(guideNames)
    );
  
    localStorage.setItem(
      'guildName',
      guildName
    );

    localStorage.setItem(
      'lastModified',
      lastModified
    );
  
    localStorage.setItem(
      'logoImage',
      logoImage
    );
    set(
      ref(db, 'guildData'),
      {
        deckPages,
        guideNames,
        guildName,
        logoImage,
        lastModified,
      }
    );
  }, [
    deckPages,
    guideNames,
    guildName,
    logoImage,
    lastModified,
  ]);

  return (
    <main className="mainLayout">
      <DeckList
  isAdmin={isAdmin}
  setIsAdmin={setIsAdmin}
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  guideNames={guideNames}
  setGuideNames={setGuideNames}
  guildName={guildName}
  setGuildName={setGuildName}
  logoImage={logoImage}
  setLogoImage={setLogoImage}
  lastModified={lastModified}
/>

      <DefenseColumn
        defenseDecks={deckPages[currentPage].defenseDecks}
        setDefenseDecks={(newDecks) => {
          setDeckPages((prev) => ({
            ...prev,
        
            [currentPage]: {
              ...prev[currentPage],
              defenseDecks:
                typeof newDecks === 'function'
                  ? newDecks(prev[currentPage].defenseDecks)
                  : newDecks,
            },
          }));
        }}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        isAdmin={isAdmin}
      />

      <CounterColumn
        counterDecks={deckPages[currentPage].counterDecks}
        setCounterDecks={(newDecks) => {
          setDeckPages((prev) => ({
            ...prev,
        
            [currentPage]: {
              ...prev[currentPage],
              counterDecks:
                typeof newDecks === 'function'
                  ? newDecks(prev[currentPage].counterDecks)
                  : newDecks,
            },
          }));
        }}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        isAdmin={isAdmin}
      />

<DetailPanel
  selectedDeck={selectedDeck}
  isAdmin={isAdmin}
  onTipChange={onTipChange}
  onSkillImageChange={onSkillImageChange}
  onSkillNameChange={onSkillNameChange}
/>
    </main>
    
  );
}
