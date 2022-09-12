import type { Deidentifier } from '../deidentifiers';
import type ActionCode from './ActionCode';

type ProfileOption = (deidentifier: Deidentifier) => ActionCode | null;

export default ProfileOption;
