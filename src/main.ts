import * as Tone from "tone";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

const notes = [
  "A2",
  "C3",
  "D3",
  "E3",
  "G3",
  "A3",
  "C4",
  "D4",
  "E4",
  "G4",
  "A4",
  "C5",
  "D5",
  "E5",
  "G5",
  "A5",
];

notes.reverse();

const TOTAL_LENGTH = 40;

function getPosition(
  distance: number,
  division: number,
  nth: number
): { x: number; y: number; z: number } {
  const theta = (2 * Math.PI * nth) / division;
  const x = Math.sin(theta) * distance;
  const y = Math.cos(theta) * distance;
  const z = 0;
  return { x, y, z };
}

let division = 3;

const PRESET: RecursivePartial<Tone.SynthOptions> = {
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.05,
    decay: 0.2,
    sustain: 0.7,
    release: 0.5,
  },
};

for (const i in notes) {
  const synth = new Tone.Synth(PRESET);
  const panner = new Tone.Panner3D(0, 0, 0);
  synth.connect(panner);
  panner.toDestination();
  let offset = 0;
  new Tone.Loop((time) => {
    const newPosition = getPosition(2, notes.length, offset);
    panner.setPosition(newPosition.x, newPosition.y, newPosition.z);
    synth.triggerAttackRelease(notes[i], "8n", time, 1.2);
  }, TOTAL_LENGTH / division).start(0);

  division += 2;
}

//attach a click listener to a play button
document.querySelector("button")?.addEventListener("click", async () => {
  await Tone.start();
  Tone.Transport.start();
  console.log("audio is ready");
});
