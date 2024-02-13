import React, { useState, useEffect } from 'react';
import './FlashCard.css';
import { Card } from './utils';
import { CustomState } from '../utils';
import { Api } from '../api/api';

interface FlashCardProps {
    cards: CustomState<Card[]>;
}

export default function FlashCard({ cards }: FlashCardProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);


    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);

        setTimeout(() => {
            setShowFeedback(false);
            if (answer === currentCard.correctAnswer) {
                setSelectedAnswer('');
                setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.get().length);
            }
        }, 1000);
    };

    const currentCard = cards.get()[currentCardIndex];

    return (
        <div className="flashcard">
            <h2>Flash Card</h2>
            {
                cards.get().length === 0 ? <div>No cards available</div> : (
                    <>
                        <div className="question">{currentCard.question}</div>
                        <div className="answers">
                            {currentCard.answers.map((answer, index) => (
                                <button key={index} onClick={() => handleAnswerSelect(answer)} disabled={showFeedback}>
                                    {answer}
                                </button>
                            ))}
                        </div>
                        {showFeedback && (
                            <div className={`feedback ${selectedAnswer === currentCard.correctAnswer ? 'correct' : 'incorrect'}`}>
                                {selectedAnswer === currentCard.correctAnswer ? 'Correct!' : 'Incorrect!'}
                            </div>
                        )}

                    </>)
            }
        </div>
    );
}