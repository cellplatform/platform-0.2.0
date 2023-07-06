# sys.ui

Modules that render UI.  These are isolated from the core `system/` modules so as to loosen the
coupling with any particular UI library/framework, which is spelled out at the root of
each modules folder name, eg:

```
   /system.ui/
             /react.*
             /(etc).*

```
