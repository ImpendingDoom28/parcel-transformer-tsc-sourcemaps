> ### All credits for the code go to [@iSplasher]('https://github.com/iSplasher')

This npm package was created based on answer from [issue]('https://github.com/parcel-bundler/parcel/issues/7570') with `@parcel/transformer-typescript-tsc`.

Until it's not resolved, this package might be handy. It allows you to see the exact line of error in your sourcemaps.

# Usage

1. Firstly, install the package:

```
npm i --save-dev parcel-transformer-tsc-sourcemaps
```

2. Then, in your `.parcelrc` file change your `"@parcel/transformer-typescript-tsc"` with `"parcel-transformer-tsc-sourcemaps"`

```json
{
	"transformers": {
    	"*.{ts,tsx}": ["parcel-transformer-tsc-sourcemaps"]
  	}
}
```

3. And that's it! Now parcel will show the exact line in your sourcemap, where the error is