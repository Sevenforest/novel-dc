import kaiAvatar from '../assets/kai_avatar.png';

export const CHARACTERS = {
  "カイ": {
    initial: "Kai",
    colorClass: "text-blue-400 border-blue-500 shadow-blue-500/50", // 青系
    hoverBgClass: "hover:bg-blue-400", // 【追加】ホバー時の背景色
    displayName: "カイ // PILOT",
    avatarSrc: kaiAvatar
  },
  "ミオ": {
    initial: "Mio",
    colorClass: "text-orange-400 border-orange-500 shadow-orange-500/50", // オレンジ系
    hoverBgClass: "hover:bg-orange-400", // 【追加】ホバー時の背景色
    displayName: "ミオ // PILOT"
  },
  "佐藤": {
    initial: "Sato",
    colorClass: "text-lime-400 border-lime-500 shadow-lime-500/50", // ライム（特殊枠）
    hoverBgClass: "hover:bg-lime-400", // 【追加】ホバー時の背景色
    displayName: "佐藤 // ISMS"
  },
  "鈴木": {
    initial: "Suzuki",
    colorClass: "text-pink-400 border-pink-500 shadow-pink-500/50", // ピンク（特殊枠）
    hoverBgClass: "hover:bg-pink-400", // 【追加】ホバー時の背景色
    displayName: "鈴木 // OBSERVER"
  },
  "SYSTEM": {
    initial: "sys",
    colorClass: "text-green-500 border-green-500 shadow-green-500/30", // 緑（標準）
    hoverBgClass: "hover:bg-green-400", // 【追加】ホバー時の背景色
    displayName: "SYSTEM_LOG"
  }
};