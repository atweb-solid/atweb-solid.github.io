# atweb-solid
Welcome to @web!

@web lets you host your own static sites on the AT Protocol. It's like [Neocities](https://neocities.org/) or [Nekoweb](https://nekoweb.org/), but on a PDS!

### Functional Elements
* `<style>[style]</style>`: Include your own styles in markup.
* `<title>[title]</title>`: Sets the page title.

### Custom Markup Elements
* `<blink>[text]</blink>`: Blinking text.
* `<marquee>[text]</marquee>`: Text that scrolls across the screen.
    - Use `<marquee party>` for party mode.

### at:// Compatible Elements
* `<img src="[link]" />`: Images with suport for relative and at:// URIs.
* `<link>`: HTML links (e.g `link rel="stylesheet"`) with suport for relative and at:// URIs.
* `<a href="[link]">[text]</a>`: HTML anchors (hyperlinks) with support for relative and at:// URIs.
* `<Stylesheet src="[link]">`: Convenience element for linking to stylesheets, with support for relative and at:// URIs.

### Custom Elements
* `<OmitVanillaCss />`: Disables all built-in styling.
* `<BlueskyPost src="at://did:plc:ragtjsm2j2vknwkz3zp4oxrd/app.bsky.feed.post/3kj2umze7zj2n" />`: A custom element for embedding Bluesky posts.
    - `src` **Required**  
    AT-URI of the post record
    - `contextless` **Optional**  
    Whether to show the post without any context (no parent reply)
    - `allow-unauthenticated` **Optional**  
    Whether to allow unauthenticated viewing
    - `service-uri` **Optional**  
    URL to an AppView service, defaults to `https://public.api.bsky.app`
* `<BlueskyProfileCard src="did:plc:2gkh62xvzokhlf6li4ol3b3d" />`: A custom element for embedding Bluesky profile cards.
    - `actor` **Required**  
    DID or handle of the account
    - `allow-unauthenticated` **Optional**  
    Whether to allow unauthenticated viewing
    - `service-uri` **Optional**  
    URL to an AppView service, defaults to `https://public.api.bsky.app`
* `<BlueskyProfileFeed actor="did:plc:ragtjsm2j2vknwkz3zp4oxrd" include-pins />`: A custom element for embedding Bluesky profile feeds.
    - `actor` **Required**  
    DID or handle of the account
    - `include-pins` **Optional**  
    Whether to show pinned posts
    - `allow-unauthenticated` **Optional**  
    Whether to allow unauthenticated viewing
    - `service-uri` **Optional**  
    URL to an AppView service, defaults to `https://public.api.bsky.app`
* `<Webamp />`: Embed Webamp in your webpage!
    - `initial-skin: { url: string }` **Optional**  
    An object representing the initial skin to use.  
    If omitted, the default skin, included in the bundle, will be used.  
    Note: This URL must be served the with correct CORS headers.  

    - `initial-tracks: { url: string; }[]` **Optional**  
    An array of tracks to prepopulate the playlist with.
    
    - `available-skins: { url: string; name: string }[]` **Optional**  
    An array of objects representing available skins.  
    These will appear in the "Options" menu under "Skins".  
    Note: These URLs must be served with the correct CORS headers.  
    Example: `[ { url: "./green.wsz", name: "Green Dimension V2" } ]`
    
    - `window-layout: WindowLayout` **Optional**  
    Configure how the Winamp windows should be laid out on initial render.

    - `enable-double-size-mode: boolean` **Optional**  
    Controls if "double size mode", where the fixed sized windows are rendered
    at 2x, should be enabled  
    **Note:** In keeping with the original Winamp, double size mode does not
    apply to resizable windows like the equalizer or Milkdrop.  
    Default: `false`
    
    - `enable-hotkeys: boolean` **Optional**  
    Should global hotkeys be enabled?  
    Default: `false`

    - `z-index: number`
* `<Spotify />`: Embedded Spotify player.
    - `uri: string` **Required**  
    Spotify song URI or ID to play.  
    - `width: number` **Optional**  
    Player width.  
    - `height: number` **Optional**  
    Player height.  
* `<Oneko />`: cat follow mouse, real
    - `cat: string` **Optional**  
    Replace the cat.  
    - `pettable: boolean` **Optional**  
    Is the cat pettable? Defaults to `true`.  
    - `scrolls: boolean` **Optional**  
    Does scrolling move the cat? Defaults to `true`.  
* `<LesbiBadge />`: Include a badge from [badge.les.bi](https://badge.les.bi/).
    - `clip: string` **Required**  
    One of: `half`, `75-degree`, `45-degree`, `diagonal`, `75-degree-alt`, `45-degree-alt`, `diagonal-alt`, `bottom-half`, `diamond`, `heart`, `heart-split`, `star`, `triangle`
    
    - `flag1: string`, `flag2: string` **Required**  
    One of: `trans`, `lesbi`, `enby`, `bi`, `rainbow`, `lesbi-7`, `gay`, `gay-7`, `agender`, `fluid`, `intersex`, `intersex-double`, `ace`, `aro`, `aroace`, `neptunic`, `genderfae`, `pan`, `polysexual`, `demi`, `genderqueer`, `poly`
    
    - `overlay: string` **Required**  
    One of: `outset`, `outset-double`, `outset-invert`, `outset-double-invert`, `gloss`
    - `svg: boolean` **Optional**  
    Render the badge as SVG, defaults to `false`.
* `<Userbar />`: Generate custom userbars!
    - `width: number` **Optional**  
    The userbar width.  
    - `height: number` **Optional**  
    The userbar height.  
    - `text: string` **Optional**  
    The userbar text.  
    - `textColor: string` **Optional**  
    The text color, in CSS format.  

    - `background-type: "gradient" | "plain"` **Optional**  
    The background type.
    - `background-position-x: number` **Required if background-type is set**  
    - `background-position-y: number` **Required if background-type is set**  
    - `background-end-position-x: number` **Required if background-type is set**  
    - `background-end-position-y: number` **Required if background-type is set**  
    - `background-color: string` or `background-colors: string[]` **Required if background-type is set**  
    The background color (or colors, for gradients), in CSS format.  

    - `textAlign: "left" | "center" | "right"` **Optional**  
    The userbar text's alignment.  
    - `textBorder: boolean` **Optional**  
    Add a border to the userbar text?  
    - `textBorderWidth: number` **Optional**  
    The border width, if set.  
    - `textBorderColor: string` **Optional**  
    The border color, if set.  
    - `pattern: "none" | "dots" | "stripes"` **Optional**  
    The pattern.  
    - `topShadow: boolean` **Optional**  
    Add a top shadow?  
* `<RingLink>[text]</RingLink>`: Adds left/right links to members of an @ring.
    - `direction: 'previous' | 'next'` **Optional**  
    The direction the link is going. Defaults to 'previous'.  
    - `ringUri: string` **Required**  
    The at:// URI to the @ring.  
    - `self: string` **Required**  
    Your DID.  
* `<Json />`
    - `value: any` **Optional**  
    Value to present. Can be JSON but also `Number`, `String`, `Array`, `Function`, `Symbol`, `Boolean`, `Date`
    - `open: 'closed' | 'full' | 'top-only'` **Required**  
        Possible values:  
        - "closed": Object is closed
        - "full": Object is fully open
        - "top-only" Only top level open
    
        Default: "closed"
* `<SocialLink />`
    - `network: 'email' | 'github' | 'gitlab' | 'linkedin' | 'rss' | 'stackoverflow' | 'twitch' | 'twitter'` **Required**  
    The network to link to.
    - `handle: string` **Required**   
    _Note: For Stackoverflow, your `USERID` is your handle_
    - `href: string` **Optional**  
    Alternatively, instead of providing a handle and relying on the built-in link you can just provide your own.

### Reversible File Path Record Key Specification
_(for nerds)_

Converting file path to Record Key:

* Strip leading `.\`, `./`, `\`, `/`.

* Replace all backslash and forward characters with `:`.

* Replace all other characters not in the regex `/[^A-Za-z0-9.\-]/`
with `'_' || base36 utf-16 char code || '_'`.

To convert in reverse, do the operation in reverse. Slash type is not
preserved (akin to Windows file paths, normalize it to a forward
slash) and all paths are assumed to be absolute.

The tilde character is not used as the PDS rejects it despite being
valid according to the spec.

Example:

```
/neocities-goodmode-sparklehorse/index.mdx
./neocities-goodmode-sparklehorse/index.mdx
neocities-goodmode-sparklehorse\index.mdx
```

becomes:

```
neocities-goodmode-sparklehorse:index.mdx
```