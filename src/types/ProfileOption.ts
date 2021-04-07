import ActionCode from './ActionCode';
import DeidentificationMatcher from '../types/DeidentificationMatcher';

type ProfileOption = (matcher: DeidentificationMatcher) => ActionCode | null;

export default ProfileOption;
