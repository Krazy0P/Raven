import { createCanvas, loadImage, registerFont } from "canvas";
import path from "node:path";

const W = 800;
const H = 200;
const R = 7;
const rightW = 180;
const rightH = 100;
const primaryColour = "#4c8de3";
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

registerFont(
  path.join(import.meta.dirname, "../../assets/JetBrainsMono-Regular.ttf"),
  { family: "JetBrainsMono" }
);


export async function generateRankCard({
  username,
  avatarURL,
  level,
  xp,
  requiredXP,
  rank,
}: {
  username: string;
  avatarURL: string;
  level: number;
  xp: number;
  requiredXP: number;
  rank: number;
}) {

  // Background
  ctx.fillStyle = "#2b2d31";
  ctx.beginPath();
  ctx.roundRect(0, 0, W - rightW - 10, H, R);
  ctx.fill();

  // Right Top panel
  ctx.fillStyle = "#1e1f22";
  ctx.beginPath();
  ctx.roundRect(620, 0, rightW, H - rightH - 5, R);
  ctx.fill();

  // Right Bottom panel
  ctx.fillStyle = "#1e1f22";
  ctx.beginPath();
  ctx.roundRect(620, rightH + 5, rightW, H - rightH - 5, R);
  ctx.fill();

  // Avatar (circular)
  const avatar = await loadImage(avatarURL);
  ctx.save();
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 40, 40, 120, 120);
  ctx.restore();

  // Avatar ring
  ctx.strokeStyle = primaryColour;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(100, 100, 62, 0, Math.PI * 2);
  ctx.stroke();

  // Username
  ctx.fillStyle = primaryColour;
  ctx.font = "bold 30px JetBrainsMono";
  ctx.fillText(username, 200, 65);

  // Server rank
  ctx.fillStyle = "#9b9b9b";
  ctx.font = "15px JetBrainsMono";
  ctx.fillText("SERVER", 200, 95+20);
  ctx.fillText("RANK", 207, 115+20);
  ctx.fillStyle = primaryColour;
  ctx.font = "bold 30px Mono";
  ctx.fillText(`#${rank}`, 200+70, 150-20);

  // // Weekly rank
  // ctx.fillStyle = "#9b9b9b";
  // ctx.font = "15px JetBrainsMono";
  // ctx.fillText("WEEKLY", 200, 95);
  // ctx.fillText("RANK", 207, 115);
  // ctx.fillStyle = primaryColour;
  // ctx.font = "30px JetBrainsMono";
  // ctx.fillText(`#${rank}`, 200, 150);

  // // Weekly Exp
  // ctx.fillStyle = "#9b9b9b";
  // ctx.font = "15px JetBrainsMono";
  // ctx.fillText("SERVER", 200, 95);
  // ctx.fillText("RANK", 207, 115);
  // ctx.fillStyle = primaryColour;
  // ctx.font = "30px JetBrainsMono";
  // ctx.fillText(`#${rank}`, 200, 150);

  // XP bar
  const barX = 200,
    barY = 148,
    barW = 390,
    barH = 14;
  const filled = Math.min(xp / requiredXP, 1) * barW;

  ctx.fillStyle = "#111214";
  ctx.beginPath();
  ctx.roundRect(0, H - barH, W - rightW - 10, barH, [0, 0, R, R]);
  ctx.fill();

  if (filled > 0) {
    ctx.fillStyle = primaryColour;
    ctx.beginPath();
    ctx.roundRect(0, H - barH, filled, barH, [0, R, R, R]);
    ctx.fill();
  }

  // Right panel — Level
  ctx.fillStyle = "#9b9b9b";
  ctx.font = "bold 13px JetBrainsMono";
  ctx.textAlign = "center";
  ctx.fillText("LEVEL", 710, 25);
  ctx.fillStyle = primaryColour;
  ctx.font = "bold 36px JetBrainsMono";
  ctx.fillText(`${level}`, 710, 65);

  // Right panel — EXP
  ctx.fillStyle = "#9b9b9b";
  ctx.font = "bold 13px JetBrainsMono";
  ctx.fillText("EXP", 710, 145);
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px JetBrainsMono";
  ctx.fillText(`${xp} / ${requiredXP}`, 710, 170);

  ctx.textAlign = "left"; // reset

  return canvas.toBuffer("image/png");
}
