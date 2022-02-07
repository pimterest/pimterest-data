with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "node";
  buildInputs = [
    chromium
    nodejs
  ];
  shellHook = ''
  export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
  }
