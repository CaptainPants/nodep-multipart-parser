
import { TextEncoder, TextDecoder } from 'util'
import { Blob } from 'buffer';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;
global.Blob = Blob as any;