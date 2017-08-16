;(function(Vue){
  Vue.directive('aotoFocus',(el,binding)=>{
    el.focus();
  })
  var lists = JSON.parse(window.localStorage.getItem('lists') || '[]')
  var filter = {
    all : function() {
      return lists
    },
    active:function(){
      return lists.filter(function(item){
          return item.iscompleted;
      })
    },
    completed:function(){
      return lists.filter(function(item){
          return !item.iscompleted;
      })
    }
  }
  
  var vm = new Vue({
    el:'#app',
    data:{
      lists:lists,
      inputText:'',
      currentEdit:null,
      currentEditText:'',
      allCheck:false,
      visibility:'all'

    },
    watch: {
      lists: {
        handler (val) {
          window.localStorage.setItem('lists', JSON.stringify(val))
        },
        deep: true
      }
    },
    methods:{
      addList () {
        if(this.inputText.trim() === ''){
          return;
        }else {
          var tempList = {
            id : this.lists.length===0?0:(this.lists[this.lists.length-1].id) + 1,
            title:this.inputText,
            iscompleted:false
          }
          this.lists.push(tempList)
          this.inputText = ''
        }
      },
      removeList (id) {
        this.lists.some((v,i) => {
          if(v.id === id){
            this.lists.splice(i,1)
            return true
          }
        })
      },
      resetList (list) {
        if(isNaN(list)){
          this.currentEdit = list
          this.currentEditText = list.title
        }else{
          this.currentEdit = null
          this.lists.some((v,i) => {
            if(v.id === list){
              this.lists[i].title = this.currentEditText
              return true
            }
          })
        }
      },
      checkAll () {
        this.lists.forEach((v)=>{
          v.iscompleted = this.allCheck
        })
      },
      checkOne () {
        var rel = this.lists.some((v)=>{
          if(!v.iscompleted){
            this.allCheck = false
            return true
          }
        })
        this.allCheck = !rel;
      },
      clearAll () {
        var tempArr = this.lists.slice(0);
        this.lists.length = 0;
        for(var i = 0;i<tempArr.length;i++){
          if(!tempArr[i].iscompleted){
            this.lists.push(tempArr[i])
          }
        }
      }
    },
    computed:{
      isNum () {
        var num = 0;
        this.lists.forEach((v)=>{
          if(!v.iscompleted){
            num++;
          }
        })
        return num
      },
      filteredList () {
        return filter[this.visibility] ? filter[this.visibility](lists) : lists;
      }
    },
  })
  function watchHashChange(){
    var hash = window.location.hash.slice(2);
    vm.visibility = hash;
  }
  watchHashChange();
  window.addEventListener("hashchange",watchHashChange);

  
})(Vue)