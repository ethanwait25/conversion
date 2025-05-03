export interface DifficultySelector {
    valueWeight: number;
    mobilityWeight: number;
    centralScoreWeight: number;
    parityWeight: number;
    threatWeight: number;
    rVariation: number;
    earlyDepth: number;
    lateDepth: number;
}

export class EasyDifficulty implements DifficultySelector {
    valueWeight = 0;
    mobilityWeight = 0;
    centralScoreWeight = 0;
    parityWeight = 1;
    threatWeight = 0;
    rVariation = 0;
    earlyDepth = 1;
    lateDepth = 1;
}

export class MediumDifficulty implements DifficultySelector {
    valueWeight = 0.25;
    mobilityWeight = 0.25;
    centralScoreWeight = 0.15;
    parityWeight = 0.15;
    threatWeight = 0.20;
    rVariation = 0;
    earlyDepth = 5;
    lateDepth = 3;
}

export class HardDifficulty implements DifficultySelector {
    valueWeight = 0.25;
    mobilityWeight = 0.25;
    centralScoreWeight = 0.15;
    parityWeight = 0.15;
    threatWeight = 0.20;
    rVariation = 0;
    earlyDepth = 5;
    lateDepth = 3;
}

export class ImpossibleDifficulty implements DifficultySelector {
    valueWeight = 0.25;
    mobilityWeight = 0.25;
    centralScoreWeight = 0.15;
    parityWeight = 0.15;
    threatWeight = 0.20;
    rVariation = 0;
    earlyDepth = 5;
    lateDepth = 3;
}

// export class OriginalDifficulty implements DifficultySelector {
//     valueWeight = 0.25;
//     mobilityWeight = 0.25;
//     centralScoreWeight = 0.15;
//     parityWeight = 0.15;
//     threatWeight = 0.20;
//     rVariation = 0;
//     earlyDepth = 5;
//     lateDepth = 3;
// }