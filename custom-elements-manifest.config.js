import { generateVsCodeCustomElementData } from "custom-element-vs-code-integration";
import manifest from './custom-elements.json' with { type: 'json' };

generateVsCodeCustomElementData(manifest, {});
