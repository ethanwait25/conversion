import { Color } from "../enums/Color.js";
import { PieceType } from "../enums/PieceType.js";
import { Assistant } from "./Assistant.js";
import { DL } from "./DL.js";
import { Missionary } from "./Missionary.js";
import { President } from "./President.js";
import { STL } from "./STL.js";
import { ZL } from "./ZL.js";

export function createPiece(type: PieceType, color: Color) {
    switch (type) {
        case PieceType.PRESIDENT: return new President(color);
        case PieceType.ASSISTANT: return new Assistant(color);
        case PieceType.ZL: return new ZL(color);
        case PieceType.DL: return new DL(color);
        case PieceType.STL: return new STL(color);
        case PieceType.MISSIONARY: return new Missionary(color);
        
        default: throw new Error(`Unknown piece type: ${type}`);
    }
}