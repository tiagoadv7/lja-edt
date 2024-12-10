// Claro, posso te ajudar com isso! Para adicionar os efeitos de **fade-in** e **fade-out** no áudio, podemos manipular a opacidade do elemento de áudio (embora o áudio em si não tenha uma propriedade de opacidade, podemos criar o efeito usando a manipulação de volume). 

// ### Passo 1: Adicionar a função `fadeOut` e `fadeIn`
// Essas funções serão responsáveis por alterar gradualmente o volume do áudio ao pausar ou ao tocar.

// ### Passo 2: Modificar as funções `play`, `pause` e `stopAudio` para incluir o efeito de fade.

// Aqui está a implementação das funções de fade-in e fade-out.

// ### 1. **Função `fadeOut` e `fadeIn`**

// Vamos criar duas funções auxiliares para controlar a transição de volume.

// ```javascript
// // Função para fazer o fade-out do áudio
// fadeOut(audio, duration = 1) {
//   return new Promise((resolve) => {
//     let fadeInterval = 50; // Intervalo em ms
//     let fadeStep = (audio.volume / (duration * 1000)) * fadeInterval; // Quanto o volume vai diminuir por intervalo
//     let currentVolume = audio.volume;

//     let fadeOutInterval = setInterval(() => {
//       currentVolume -= fadeStep;
//       if (currentVolume <= 0) {
//         clearInterval(fadeOutInterval);
//         audio.volume = 0; // Garantir que o volume chegue a 0
//         resolve(); // Finaliza o fade
//       } else {
//         audio.volume = currentVolume;
//       }
//     }, fadeInterval);
//   });
// }

// // Função para fazer o fade-in do áudio
// fadeIn(audio, duration = 1) {
//   return new Promise((resolve) => {
//     let fadeInterval = 50; // Intervalo em ms
//     let fadeStep = (1 / (duration * 1000)) * fadeInterval; // Quanto o volume vai aumentar por intervalo
//     let currentVolume = 0;

//     let fadeInInterval = setInterval(() => {
//       currentVolume += fadeStep;
//       if (currentVolume >= 1) {
//         clearInterval(fadeInInterval);
//         audio.volume = 1; // Garantir que o volume chegue a 1
//         resolve(); // Finaliza o fade
//       } else {
//         audio.volume = currentVolume;
//       }
//     }, fadeInterval);
//   });
// }
// ```

// ### 2. **Integrando com as funções de controle do áudio**

// Agora, vamos usar essas funções dentro dos métodos `play`, `pause` e `stopAudio`.

// #### Alterações na função `play`:

// Ao clicar em play, vamos fazer o **fade-in** do áudio.

// ```javascript
// play() {
//   this.fadeIn(this.getElement(), 2).then(() => { // Fade-in de 2 segundos
//     this.pause(false); // Reproduzir o áudio normalmente
//   });
// }
// ```

// #### Alterações na função `pause`:

// Quando a música for pausada, vamos aplicar o **fade-out** antes de pausar o áudio.

// ```javascript
// pause(bool = true) {
//   const audio = this.getElement();

//   $appdata.set("modules.media.config.is_paused", bool);

//   if (bool) {
//     this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
//       audio.pause(); // Pausa o áudio após o fade-out
//     });
//   } else {
//     let self = this;
//     const playResult = audio.play();
//     playResult.catch((e) => {
//       window.playResultError = e;
//       $alert.error(
//         {
//           text: "modules.media.alerts.not_loaded",
//           error: e || "",
//         },
//         function (a) {
//           if (a) {
//             self.open($appdata.get("modules.media.id_music"));
//           }
//         }
//       );
//     });
//   }
// }
// ```

// #### Alterações na função `stopAudio`:

// No caso de parar o áudio, queremos fazer um **fade-out** antes de limpar o áudio.

// ```javascript
// stopAudio() {
//   const audio = this.getElement();
//   this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
//     this.pause(true);
//     audio.setAttribute("src", "");
//   });
// }
// ```

// ### 3. **Opções adicionais**

// - **Duração do fade**: A duração do fade é ajustável, você pode passar um valor para o parâmetro `duration` nas funções `fadeOut` e `fadeIn` para ajustar o tempo de transição (o valor padrão é 1 segundo).
  
// - **Outros efeitos**: Além de manipular o volume, você pode aplicar transições CSS para o elemento `audio`, mas como o áudio em si não é visível, o controle de volume é a forma mais eficaz de fazer um fade.

// ### 4. **Adicionando as funções ao código original**

// Agora, integrei as funções de fade no seu código.

// ```javascript
// export default {
//   // ... outras funções do código original

//   // Função para fazer o fade-out do áudio
//   fadeOut(audio, duration = 1) {
//     return new Promise((resolve) => {
//       let fadeInterval = 50; // Intervalo em ms
//       let fadeStep = (audio.volume / (duration * 1000)) * fadeInterval; // Quanto o volume vai diminuir por intervalo
//       let currentVolume = audio.volume;

//       let fadeOutInterval = setInterval(() => {
//         currentVolume -= fadeStep;
//         if (currentVolume <= 0) {
//           clearInterval(fadeOutInterval);
//           audio.volume = 0; // Garantir que o volume chegue a 0
//           resolve(); // Finaliza o fade
//         } else {
//           audio.volume = currentVolume;
//         }
//       }, fadeInterval);
//     });
//   },

//   // Função para fazer o fade-in do áudio
//   fadeIn(audio, duration = 1) {
//     return new Promise((resolve) => {
//       let fadeInterval = 50; // Intervalo em ms
//       let fadeStep = (1 / (duration * 1000)) * fadeInterval; // Quanto o volume vai aumentar por intervalo
//       let currentVolume = 0;

//       let fadeInInterval = setInterval(() => {
//         currentVolume += fadeStep;
//         if (currentVolume >= 1) {
//           clearInterval(fadeInInterval);
//           audio.volume = 1; // Garantir que o volume chegue a 1
//           resolve(); // Finaliza o fade
//         } else {
//           audio.volume = currentVolume;
//         }
//       }, fadeInterval);
//     });
//   },

//   // Função para iniciar o áudio com fade-in
//   play() {
//     this.fadeIn(this.getElement(), 2).then(() => { // Fade-in de 2 segundos
//       this.pause(false); // Reproduzir o áudio normalmente
//     });
//   },

//   // Função para pausar o áudio com fade-out
//   pause(bool = true) {
//     const audio = this.getElement();

//     $appdata.set("modules.media.config.is_paused", bool);

//     if (bool) {
//       this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
//         audio.pause(); // Pausa o áudio após o fade-out
//       });
//     } else {
//       let self = this;
//       const playResult = audio.play();
//       playResult.catch((e) => {
//         window.playResultError = e;
//         $alert.error(
//           {
//             text: "modules.media.alerts.not_loaded",
//             error: e || "",
//           },
//           function (a) {
//             if (a) {
//               self.open($appdata.get("modules.media.id_music"));
//             }
//           }
//         );
//       });
//     }
//   },

//   // Função para parar o áudio com fade-out
//   stopAudio() {
//     const audio = this.getElement();
//     this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
//       this.pause(true);
//       audio.setAttribute("src", "");
//     });
//   },

//   // ... outras funções do código original
// };
// ```

// Agora você tem os efeitos de **fade-in** e **fade-out** implementados nas funções de controle do áudio!


import $dev from "@/helpers/Dev";
import $appdata from "@/helpers/AppData";
import $userdata from "@/helpers/UserData";
import $datetime from "@/helpers/DateTime";
import $path from "@/helpers/Path";
import $alert from "@/helpers/Alert";
import $modules from "@/helpers/Modules";
import $database from "@/helpers/Database";

export default {
  async open(params) {
    if (typeof params != "object") {
      params = { id_music: params };
    }
    $dev.write("open media", params);

    this.stopAudio();
    this.clearVariables();

    const id_music = params.id_music;
    const minimized = params.minimized ? params.minimized : false;
    const id_album = params.id_album ? params.id_album : null;
    let mode = params.mode ? params.mode : "no_audio";

    $appdata.set("modules.media.loading", true);

    let data = await $database.get(`music_${id_music}`);
    if (data == null) {
      this.close(true);
      return;
    }
    $appdata.set("modules.media.data", data);

    $appdata.set("modules.media.id_music", id_music);
    $appdata.set("modules.media.id_album", id_album);
    $appdata.set("modules.media.config.slide_index", 0);
    $appdata.set("modules.media.config.title", data.name);
    $appdata.set("modules.media.config.last_slide", this.slides().length);
    $appdata.set("modules.media.times", []);
    this.setAlbumInfo(id_album);

    if (minimized) {
      this.minimize();
    } else {
      this.maximize();
    }

    if (mode == "audio" || mode == "instrumental") {
      //Será executado com áudio... cria o elemento de audio
      const audio = this.getElement();
      this.pause(true);
      audio.currentTime = 0;

      //Grava os tempos dos slides
      $appdata.set(
        "modules.media.times",
        this.slides().map((item) =>
          $datetime.toNumber(
            mode == "audio" ? item.time : item.instrumental_time
          )
        )
      );

      $appdata.set(
        "modules.media.config.audio",
        $path.file(
          mode == "audio" ? data.url_music : data.url_instrumental_music
        )
      );

      if (
        $appdata.get("is_online") &&
        $userdata.get("modules.media.lazy_load")
      ) {
        //Se a opção lazy_load estiver marcada, execução rápida (o audio vai carregando enquanto é executado)
        $appdata.set("modules.media.config.lazy", true);
        audio.src = $appdata.get("modules.media.config.audio");
        audio.load();
        $appdata.set("modules.media.loading", false);
        this.play();
      } else {
        //Se a opção lazy_load estiver desmarcada, execução lenta (o audio só é executado depois de totalmente carregado)
        $appdata.set("modules.media.config.lazy", false);
        let self = this;
        let request = new XMLHttpRequest();
        try {
          request.open("GET", $appdata.get("modules.media.config.audio"), true);
        } catch (error) {
          $alert.error(
            { text: "modules.media.alerts.not_loaded", error },
            function (a) {
              if (a) {
                self.open(id_music);
              }
            }
          );
          return;
        }

        request.responseType = "blob";
        request.onload = function () {
          if (this.status == 200) {
            audio.src = URL.createObjectURL(this.response);
            audio.load();
            self.play();
          } else {
            $alert.error(
              {
                text: "modules.media.alerts.not_loaded",
                error: request.statusText || "",
              },
              function (a) {
                if (a) {
                  self.open(id_music);
                }
              }
            );
          }
        };
        request.onerror = function () {
          $alert.error(
            {
              text: "modules.media.alerts.not_loaded",
              error: request.statusText || "",
            },
            function (a) {
              if (a) {
                self.open(id_music);
              }
            }
          );
          return;
        };

        request.send();
        $appdata.set("modules.media.loading", false);
      }
    } else {
      $appdata.set("modules.media.config.audio", "");
      $appdata.set("modules.media.loading", false);
    }

    $appdata.set("modules.media.config.mode", mode);
  },

  close(force = false) {
    //Se force for true, fechamento forçado. Sem diálogo de confirmação!
    if (!force) {
      const self = this;
      $alert.yesno("modules.media.alerts.close", function (btn) {
        if (btn == "yes") {
          self.close(true);
        }
      });
      return;
    }

    this.stopAudio();
    this.clearVariables();
    $appdata.set("modules.media.show", false);
    $appdata.set("modules.media.minimized", false);
  },

  async openLyric(params) {
    if (params == null || params == undefined) {
      params = {
        id_music: $appdata.get("modules.media.id_music"),
        id_album: $appdata.get("modules.media.id_album"),
      };
    } else if (typeof params != "object") {
      params = { id_music: params };
    }
    $dev.write("open lyric", params);

    const id_music = params.id_music;
    const id_album = params.id_album ? params.id_album : null;

    $appdata.set("modules.lyric.loading", true);

    let data = await $database.get(`music_${id_music}`);
    if (data == null) {
      this.closeLyric();
      return;
    }

    $appdata.set("modules.lyric.data", data);

    $appdata.set("modules.lyric.id_music", id_music);
    $appdata.set("modules.lyric.id_album", id_album);
    $appdata.set("modules.lyric.config.title", data.name);

    this.setAlbumInfo(id_album, "lyric");

    $appdata.set("modules.lyric.show", true);
    $appdata.set("modules.lyric.loading", false);
  },
  async closeLyric() {
    $dev.write("close lyric");
    $appdata.set("modules.lyric.show", false);

    $appdata.set("modules.lyric.data", {});
    $appdata.set("modules.lyric.id_music", null);
    $appdata.set("modules.lyric.id_album", null);
    $appdata.set("modules.lyric.config.title", null);
    $appdata.set("modules.lyric.loading", false);
  },

  async openAlbum(id_album) {
    $dev.write("open album", id_album);

    $appdata.set("modules.album.loading", true);

    let data = await $database.get(`album_${id_album}`);
    if (data == null) {
      this.closeAlbum();
      return;
    }

    $appdata.set("modules.album.data", data);

    let hymnal = data.categories.filter((item) =>
      item.startsWith("hymnal.")
    )[0];
    if (hymnal) {
      $modules.open(hymnal.split(".")[1]);
      return;
    }

    $appdata.set("modules.album.id_album", id_album);
    $appdata.set("modules.album.show", true);
    $appdata.set("modules.album.loading", false);
  },
  async closeAlbum() {
    $dev.write("close album");
    $appdata.set("modules.album.show", false);

    $appdata.set("modules.album.data", {});
    $appdata.set("modules.album.id_album", null);
    $appdata.set("modules.album.loading", false);
  },

  stopAudio() {
    const audio = this.getElement();
    this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
      this.pause(true);
      audio.setAttribute("src", "");
    });
  },

  clearVariables() {
    $appdata.set("modules.media.data", {});
    $appdata.set("modules.media.id_music", null);
    $appdata.set("modules.media.config.title", "");
    $appdata.set("modules.media.config.subtitle", "");
    $appdata.set("modules.media.config.track", 0);
    $appdata.set("modules.media.config.image", "");
    $appdata.set("modules.media.config.slide_index", 0);
    $appdata.set("modules.media.config.last_slide", 0);
    $appdata.set("modules.media.config.audio", "");
    $appdata.set("modules.media.config.lazy", false);
    $appdata.set("modules.media.config.current_time", 0);
    $appdata.set("modules.media.config.duration", 0);
    $appdata.set("modules.media.config.progress", 0);
    $appdata.set("modules.media.config.slide_progress", 0);
    $appdata.set("modules.media.config.buffered", 0);
  },

  minimize() {
    $appdata.set("modules.media.show", false);
    $appdata.set("modules.media.minimized", true);
  },

  maximize() {
    $appdata.set("modules.media.show", true);
    $appdata.set("modules.media.minimized", false);
  },

  isMinimized() {
    return $appdata.get("modules.media.minimized", false);
  },

  isLoading() {
    return $appdata.get("modules.media.loading", false);
  },

  config() {
    return $appdata.get("modules.media.config");
  },

  slides() {
    let data = $appdata.get("modules.media.data");

    let prev_image = data.url_image;
    let prev_image_position = data.image_position;

    return [
      {
        lyric: data.name,
        cover: true,
        time: "00:00:00",
        instrumental_time: "00:00:00",
        url_image: data.url_image,
        image_position: data.image_position,
      },
      ...Object.values(data.lyric || {})
        .filter((lyric) => lyric.show_slide === 1)
        .sort((a, b) => a.order - b.order)
        .map((lyric) => {
          if (lyric.url_image) {
            prev_image = lyric.url_image;
            prev_image_position = lyric.image_position;
          }
          return {
            ...lyric,
            cover: false,
            lyric: lyric.lyric ? lyric.lyric.replace(/[\r\n]+/g, "<br>") : "",
            url_image: prev_image,
            image_position: prev_image_position,
          };
        }),
    ];
  },

  slide() {
    let slides = this.slides() ?? [];
    let index = $appdata.get("modules.media.config.slide_index");
    return slides[index];
  },

  goToSlide(index) {
    const last_slide = $appdata.get("modules.media.config.last_slide");

    if (index > last_slide - 1) {
      index = last_slide - 1;
    }
    if (index < 0) {
      index = 0;
    }

    const duration = $appdata.get("modules.media.config.duration");
    const audio = $appdata.get("modules.media.config.audio");

    if (duration > 0 && audio != "") {
      const times = $appdata.get("modules.media.times");
      this.goToTime(times[index] || 0);
    } else {
      $appdata.set("modules.media.config.slide_index", index);
    }
  },
  goToTime(time) {
    const audio = this.getElement();
    const duration = $appdata.get("modules.media.config.duration");
    if (time == undefined || time < 0) {
      time = 0;
    } else if (time > duration) {
      time = duration;
    }
    audio.currentTime = time;
  },
  advanceTime(time = 10) {
    const duration = $appdata.get("modules.media.config.duration");
    const audio = $appdata.get("modules.media.config.audio");
    const current_time = $appdata.get("modules.media.config.current_time");

    if (duration > 0 && audio != "") {
      this.goToTime(current_time + time);
    }
  },
  
  fadeOut(audio, duration = 1) {
    return new Promise((resolve) => {
      let fadeInterval = 50; // Intervalo em ms
      let fadeStep = (audio.volume / (duration * 1000)) * fadeInterval; // Quanto o volume vai diminuir por intervalo
      let currentVolume = audio.volume;

      let fadeOutInterval = setInterval(() => {
        currentVolume -= fadeStep;
        if (currentVolume <= 0) {
          clearInterval(fadeOutInterval);
          audio.volume = 0; // Garantir que o volume chegue a 0
          resolve(); // Finaliza o fade
        } else {
          audio.volume = currentVolume;
        }
      }, fadeInterval);
    });
  },

  fadeIn(audio, duration = 1) {
    return new Promise((resolve) => {
      let fadeInterval = 50; // Intervalo em ms
      let fadeStep = (1 / (duration * 1000)) * fadeInterval; // Quanto o volume vai aumentar por intervalo
      let currentVolume = 0;

      let fadeInInterval = setInterval(() => {
        currentVolume += fadeStep;
        if (currentVolume >= 1) {
          clearInterval(fadeInInterval);
          audio.volume = 1; // Garantir que o volume chegue a 1
          resolve(); // Finaliza o fade
        } else {
          audio.volume = currentVolume;
        }
      }, fadeInterval);
    });
  },

  play() {
    this.fadeIn(this.getElement(), 2).then(() => { // Fade-in de 2 segundos
      this.pause(false); // Reproduzir o áudio normalmente
    });
  },
  pause(bool = true) {
    const audio = this.getElement();

    $appdata.set("modules.media.config.is_paused", bool);

    if (bool) {
      this.fadeOut(audio, 2).then(() => { // Fade-out de 2 segundos
        audio.pause(); // Pausa o áudio após o fade-out
      });
    } else {
      let self = this;
      const playResult = audio.play();
      playResult.catch((e) => {
        window.playResultError = e;
        $alert.error(
          {
            text: "modules.media.alerts.not_loaded",
            error: e || "",
          },
          function (a) {
            if (a) {
              self.open($appdata.get("modules.media.id_music"));
            }
          }
        );
      });
    }
  },
  firstSlide() {
    this.goToSlide(0);
  },
  prevSlide() {
    const slide_index = $appdata.get("modules.media.config.slide_index");
    this.goToSlide(slide_index - 1);
  },
  nextSlide() {
    const slide_index = $appdata.get("modules.media.config.slide_index");
    this.goToSlide(slide_index + 1);
  },
  lastSlide() {
    const last_slide = $appdata.get("modules.media.config.last_slide");
    this.goToSlide(last_slide - 1);
  },
  setVolume(val) {
    const audio = this.getElement();
    audio.volume = val / 100;
    $appdata.set("modules.media.config.volume", val);
  },
  toogleVolume() {
    let volume = $appdata.get("modules.media.config.volume");
    volume = volume < 100 ? 100 : 0;
    this.setVolume(volume);
  },

  fullscreen(value = true) {
    $appdata.set("modules.media.config.fullscreen", value);
  },

  setAlbumInfo(id_album, module = "media") {
    const data = $appdata.get(`modules.${module}.data`);
    if (data.albums.length <= 0) {
      $appdata.set(`modules.${module}.config.subtitle`, "");
      $appdata.set(`modules.${module}.config.track`, 0);
      $appdata.set(`modules.${module}.config.image`, "");
      return;
    }

    let album = null;
    if (id_album) {
      album = data.albums.filter((item) => item.id_album == id_album)[0];
    } else if (data.albums.length === 1) {
      album = data.albums[0];
    } else {
      album = data.albums.sort((a, b) => a.order - b.order)[0];
    }

    if (!album) {
      $appdata.set(`modules.${module}.config.subtitle`, "");
      $appdata.set(`modules.${module}.config.track`, 0);
      $appdata.set(`modules.${module}.config.image`, "");
      return;
    }

    $appdata.set(`modules.${module}.config.subtitle`, album.name);
    $appdata.set(`modules.${module}.config.track`, album.track);
    $appdata.set(`modules.${module}.config.image`, album.url_image);
  },

  timeUpdate() {
    const audio = this.getElement();
    const current_time = isNaN(audio.currentTime) ? 0 : audio.currentTime;
    const duration = isNaN(audio.duration) ? 0 : audio.duration;
    const progress = duration <= 0 ? 0 : (current_time / duration) * 100;
    let buffered = 0;

    $appdata.set("modules.media.config.current_time", current_time);
    $appdata.set("modules.media.config.duration", duration);
    $appdata.set("modules.media.config.progress", progress);

    if (!$appdata.get("modules.media.config.lazy")) {
      try {
        audio.buffered = 100;
      } catch (error) {
        //
      }
      buffered = 100;
    } else {
      buffered = 0;
      let audio_buffered = audio.buffered; // Obter intervalos de buffer carregados
      if (audio_buffered.length > 0) {
        buffered = (audio_buffered.end(0) / audio.duration) * 100;
      }
    }

    $appdata.set("modules.media.config.buffered", buffered);

    const times = $appdata.get("modules.media.times");
    const slide_index = times.filter((time) => time <= current_time).length - 1;
    $appdata.set(
      "modules.media.config.slide_index",
      slide_index <= 0 ? 0 : slide_index
    );

    const start_time = times[slide_index];
    const end_time = times[slide_index + 1] || duration;
    const slide_progress =
      ((current_time - start_time) / (end_time - start_time)) * 100;
    $appdata.set("modules.media.config.slide_progress", slide_progress);

    this.checkTime();
  },
  checkTime() {
    const is_paused = $appdata.get("modules.media.config.is_paused");
    const current_time = $appdata.get("modules.media.config.current_time");
    const duration = $appdata.get("modules.media.config.duration");
    if (!is_paused && current_time >= duration && duration > 0) {
      this.close(true);
    }
  },
  getElement() {
    let el;
    let id = "__audio";
    if (!document.getElementById(id)) {
      el = document.createElement("audio");
      el.setAttribute("id", id);
      el.setAttribute("preload", "auto");
      document.body.appendChild(el);
      el.addEventListener("timeupdate", this.timeUpdate.bind(this));
      el.addEventListener("progress", this.timeUpdate.bind(this));
    } else {
      el = document.getElementById(id);
    }

    el.setAttribute("autoplay", true);
    return el;
  },
};

