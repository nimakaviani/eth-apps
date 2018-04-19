  function voteForCandidate(){
    $.get("http://vora.bosh-lite.com/vote", {name: $("#candidate")})
  }

