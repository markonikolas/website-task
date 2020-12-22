// Utility file, import if neded.
import { join, add } from 'lodash-es';

export default function utils() {
	const arr = [ 1, 2, 5, 6, 7 ];
	const addition = add( arr[1] + arr[2], arr[3] );

	return join( arr, addition, ' ' );
}
