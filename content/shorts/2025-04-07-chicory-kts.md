+++
title = "chicory build.gradle.kts"
+++

The docs only showed how to do it in maven and it took a bit of trial and error before I got it working.

```diff
diff --git a/4-application/app/build.gradle.kts b/4-application/app/build.gradle.kts
index 55b64da..5f56ba6 100644
--- a/4-application/app/build.gradle.kts
+++ b/4-application/app/build.gradle.kts
@@ -5,6 +5,7 @@ plugins {
     id("com.google.devtools.ksp")
     id("com.chaquo.python")
     kotlin("plugin.serialization")
+    kotlin("kapt")
 }
 
 android {
@@ -86,8 +87,11 @@ dependencies {
     implementation(libs.coil.network)
     implementation(libs.converter.gson)
 
+    implementation(libs.chicory.runtime)
+    implementation(libs.chicory.annotations)
     implementation(libs.androidx.datastore.preferences)
     testImplementation(libs.kotlinx.coroutines.test)
 
     ksp(libs.androidx.room.compiler)
-}
+    kapt(libs.chicory.processor)
+}
```

```
diff --git a/4-application/gradle/libs.versions.toml b/4-application/gradle/libs.versions.toml
index a760189..2e27d4f 100644
--- a/4-application/gradle/libs.versions.toml
+++ b/4-application/gradle/libs.versions.toml
@@ -2,26 +2,26 @@
[versions]
 +chicory = "1.2.1"
 
 [libraries]
+chicory-runtime = { module = "com.dylibso.chicory:runtime", version.ref = "chicory" }
+chicory-annotations = {module = "com.dylibso.chicory:host-module-annotations-experimental", version.ref = "chicory" }
+chicory-processor = {module = "com.dylibso.chicory:host-module-processor-experimental", version.ref = "chicory"}
```

`kapt` is used rather than `ksp` despite being deprecated due to incompatibilities.

Also, example zig `wasm`

```zig
extern "wasm" fn log(ptr: [*]const u8, len: i32) void;

export fn add(a: i32, b: i32) i32 {
    log("Hello world!", 12);
    return a + b;
}
```

```kotlin
@HostModule("wasm")
class WasmHost(ctx: MyAppContext){
    @WasmExport
    fun log(memory: Memory, ptr: Int, len: Int) {
        val text = memory.readString(ptr, len)
        Log.i("WASM", "$text")
    }

    fun toHostFunctions(): Array<HostFunction> {
        return WasmHost_ModuleFactory.toHostFunctions(this)
    }
}
```

Note that you need to do `extern "<module name>"` which corresponds to `@HostModule("<module name>")`. Strings are passed as i32 pointers.
