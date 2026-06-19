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
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('deck1');
  const [deckPages, setDeckPages] = useState({
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
  });
  const [guideNames, setGuideNames] =
  useState([
    '덱 1',
    '덱 2',
    '덱 3',
    '덱 4',
  ]);
  
  const [guildName, setGuildName] =
  useState('길드 이름');

  const [lastModified, setLastModified] =
  useState('');

  const [logoImage, setLogoImage] =
  useState('');
  
  const onTipChange = (
    deckId: any,
    newTip: any
  ) => {
    setDeckPages((prev: any) => ({
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
    deckId: any,
    skillIndex: any,
    imageUrl: any
  ) => {
    setDeckPages((prev: any) => ({
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
    deckId: any,
    skillIndex: any,
    newName: any
  ) => {
    setDeckPages((prev: any) => ({
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
    const savedDeckPages =
      localStorage.getItem('deckPages');
  
    if (savedDeckPages) {
      setDeckPages(
        JSON.parse(savedDeckPages)
      );
    }
  
    const savedGuideNames =
      localStorage.getItem('guideNames');
  
    if (savedGuideNames) {
      setGuideNames(
        JSON.parse(savedGuideNames)
      );
    }
  
    const savedGuildName =
      localStorage.getItem('guildName');
  
    if (savedGuildName) {
      setGuildName(savedGuildName);
    }
  
    const savedLogo =
      localStorage.getItem('logoImage');
  
    if (savedLogo) {
      setLogoImage(savedLogo);
    }
  
    const savedDate =
      localStorage.getItem('lastModified');
  
    if (savedDate) {
      setLastModified(savedDate);
    }
  }, []);

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
          setDeckPages((prev: any) => ({
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
          setDeckPages((prev: any) => ({
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
